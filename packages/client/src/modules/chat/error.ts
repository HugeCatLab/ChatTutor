export class ChatIsRunningError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ChatIsRunningError'
  }
}

export class AgentConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AgentConfigError'
  }
}
