import { useEffect, useRef, useState } from 'react'
import useAppStore from '../store/appState.js'
import { createAgentLoop } from '../logic/agentLoop.js'

/**
 * Hook that runs the autonomous agent loop
 * Starts automatically when user is onboarded
 */
export function useAgentLoop() {
  const agentRef = useRef(null)
  const [agentEvents, setAgentEvents] = useState([])
  const [latestEvent, setLatestEvent] = useState(null)
  const [isAgentRunning, setIsAgentRunning] = useState(false)

  const user = useAppStore(state => state.user)

  /**
   * Handle agent events — these are what the UI listens to
   */
  const handleEvent = (event) => {
    setLatestEvent(event)
    setAgentEvents(prev => [
      { ...event, timestamp: new Date().toISOString() },
      ...prev.slice(0, 49) // keep last 50 events
    ])
  }

  /**
   * Start agent when user completes onboarding
   */
  useEffect(() => {
    if (!user.onboardingComplete) return

    // Create agent with direct store access
    const agent = createAgentLoop(
      () => useAppStore.getState(),
      (updates) => useAppStore.setState(updates),
      handleEvent
    )

    agentRef.current = agent

    // Start with 30 second interval
    agent.start(30000)
    setIsAgentRunning(true)

    // Cleanup on unmount
    return () => {
      agent.stop()
      setIsAgentRunning(false)
    }
  }, [user.onboardingComplete])

  /**
   * Force agent to run immediately
   */
  const triggerAgent = () => {
    if (agentRef.current) {
      agentRef.current.forceTick()
    }
  }

  /**
   * Stop agent manually
   */
  const stopAgent = () => {
    if (agentRef.current) {
      agentRef.current.stop()
      setIsAgentRunning(false)
    }
  }

  /**
   * Start agent manually
   */
  const startAgent = () => {
    if (agentRef.current) {
      agentRef.current.start(30000)
      setIsAgentRunning(true)
    }
  }

  return {
    isAgentRunning,
    agentEvents,
    latestEvent,
    triggerAgent,
    stopAgent,
    startAgent,
  }
}