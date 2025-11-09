import type { Message } from 'xsai'

export interface Context {
  agent: Message[]
  painter: Message[]
}