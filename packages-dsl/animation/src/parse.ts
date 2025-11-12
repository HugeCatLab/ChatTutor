/**
 * # Animation DSL
 * `{easing}name<duration, delay>(...params)`
 * - easing: optional, default to `linear`
 * - name: required
 * - duration: required, in seconds
 * - delay: optional, in seconds
 * - params: optional, list of parameters
 */

import type { Animation } from "@dsl/renderer-core"

const EASING_MATCH_REG = /{([^}]+)}/
const DURATION_AND_DELAY_MATCH_REG = /<([^>]+)>/
const PARAMS_MATCH_REG = /\(([^)]+)\)/

export const parseAnimation = (source: string): Animation | null => {
  const [, easing] = source.match(EASING_MATCH_REG) ?? []

  let remaining = source.replace(EASING_MATCH_REG, '')

  const [, _durationAndDelay] = remaining.match(DURATION_AND_DELAY_MATCH_REG) ?? []
  if (!_durationAndDelay) return null
  const [duration, delay] = _durationAndDelay.split(',').map(Number)

  remaining = remaining.replace(DURATION_AND_DELAY_MATCH_REG, '')

  const [, _params] = remaining.match(PARAMS_MATCH_REG) ?? []
  const params: string[] = []
  if (_params) {
    params.push(..._params.split(',').map(s => s.trim()))
  }

  const name = remaining.replace(PARAMS_MATCH_REG, '').trim()

  return {
    duration,
    delay,
    params,
    easing,
    preset: name,
  }
}