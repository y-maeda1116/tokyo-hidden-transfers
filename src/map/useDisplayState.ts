import { useCallback, useReducer } from 'react'
import {
  INITIAL_DISPLAY_STATE,
  displayReducer,
  type Category,
  type DisplayState,
  type LayerKey,
} from '../domain/displayVisibility.ts'

/** 表示状態の保持と操作を提供するフック（Reducer の thin ラッパ）。 */
export function useDisplayState(): {
  state: DisplayState
  toggleCategory: (category: Category) => void
  toggleLine: (lineId: string) => void
  toggleLayer: (layer: LayerKey) => void
} {
  const [state, dispatch] = useReducer(displayReducer, INITIAL_DISPLAY_STATE)
  const toggleCategory = useCallback(
    (category: Category) => dispatch({ type: 'toggleCategory', category }),
    [],
  )
  const toggleLine = useCallback(
    (lineId: string) => dispatch({ type: 'toggleLine', lineId }),
    [],
  )
  const toggleLayer = useCallback(
    (layer: LayerKey) => dispatch({ type: 'toggleLayer', layer }),
    [],
  )
  return { state, toggleCategory, toggleLine, toggleLayer }
}
