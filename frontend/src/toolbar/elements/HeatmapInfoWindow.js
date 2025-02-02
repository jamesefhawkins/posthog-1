import React from 'react'
import { useActions, useValues } from 'kea'
import { CloseOutlined } from '@ant-design/icons'
import { elementsLogic } from '~/toolbar/elements/elementsLogic'
import { ElementInfo } from '~/toolbar/elements/ElementInfo'

export function HeatmapInfoWindow() {
    const { hoverElement, hoverElementMeta, selectedElement, selectedElementMeta, hoverElementHighlight } = useValues(
        elementsLogic
    )
    const { setSelectedElement } = useActions(elementsLogic)
    const { rectUpdateCounter: __discardButReloadComponentOnChanges } = useValues(elementsLogic) // eslint-disable-line

    const activeMeta = hoverElementMeta || selectedElementMeta

    if (hoverElementHighlight || !activeMeta) {
        return null
    }

    const pointerEvents = selectedElementMeta && (!hoverElement || hoverElement === selectedElement)
    const onClose =
        selectedElementMeta && activeMeta.element === selectedElementMeta.element
            ? () => setSelectedElement(null)
            : null
    const { rect } = activeMeta

    let left = rect.left + window.pageXOffset + (rect.width > 300 ? (rect.width - 300) / 2 : 0)
    let width = 300
    if (left + width > window.innerWidth - 10) {
        left -= left + width - (window.innerWidth - 10)
        if (left < 0) {
            left = 5
            width = window.innerWidth - 10
        }
    }

    let top = Math.max(window.pageYOffset + 8, rect.top + rect.height + 10 + window.pageYOffset)
    let bottom
    let minHeight = 50
    let maxHeight

    const spaceAbove = Math.max(minHeight, rect.top - 20)
    const spaceBelow = Math.max(minHeight, window.innerHeight - top + window.pageYOffset - 10)

    if (spaceAbove > spaceBelow) {
        top = undefined
        bottom = window.innerHeight - rect.top + 10 - window.pageYOffset
        maxHeight = spaceAbove
    } else {
        maxHeight = spaceBelow
    }

    return (
        <div
            style={{
                pointerEvents: pointerEvents ? 'all' : 'none',
                position: 'absolute',
                top,
                bottom,
                left,
                width,
                minHeight,
                maxHeight,
                zIndex: 6,
                opacity: 1,
                transformOrigin: 'top left',
                transition: 'opacity 0.2s, box-shadow 0.2s',
                backgroundBlendMode: 'multiply',
                background: 'white',
                boxShadow: `hsla(4, 30%, 27%, 0.6) 0px 3px 10px 2px`,
            }}
        >
            {onClose ? (
                <div
                    onClick={onClose}
                    style={{
                        pointerEvents: pointerEvents ? 'all' : 'none',
                        position: 'absolute',
                        top: -8,
                        right: left + width > window.innerWidth - 20 ? -6 : -12,
                        transformOrigin: 'top left',
                        background: 'black',
                        color: 'white',
                        boxShadow: `hsla(4, 30%, 27%, 0.6) 0px 3px 10px 2px`,
                        borderRadius: '100%',
                        width: 24,
                        height: 24,
                        zIndex: 7,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        textAlign: 'center',
                        cursor: 'pointer',
                    }}
                >
                    <CloseOutlined />
                </div>
            ) : null}
            <div style={{ minHeight, maxHeight, overflow: 'auto', padding: 15 }}>
                <ElementInfo />
            </div>
        </div>
    )
}
