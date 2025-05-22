import React, { useEffect, useState, createRef } from 'react'
import styled from 'styled-components'

type Props = {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

const GenericModal: React.FC<Props> = (props) => {
  const modalRef = createRef<HTMLDivElement>()
  const { open, onClose } = props
  const [internalOpen, setInternalOpen] = useState(open)

  const handleClick = () => {
    onClose?.()
  }

  useEffect(() => {
    const closeEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeEsc)
    return () => window.removeEventListener('keydown', closeEsc)
  }, [])

  useEffect(() => {
    if (!modalRef.current) return

    const modal = modalRef.current

    setTimeout(() => {
      if (open) setInternalOpen(true)
      else setInternalOpen(false)
    })

    const detectMousePosition = (e: MouseEvent) => {
      if (internalOpen) return

      var windowWidth = window.innerWidth,
        windowHeight = window.innerHeight,
        modalWidth = modal.offsetWidth,
        modalHeight = modal.offsetHeight,
        _x = e.clientX,
        _y = e.clientY

      var x = _x - windowWidth / 2 + modalWidth / 2
      var y = _y - windowHeight / 2 + modalHeight / 2

      modal.style.transformOrigin = `${x}px ${y}px`
    }

    document.addEventListener('click', detectMousePosition)

    return () => {
      document.removeEventListener('click', detectMousePosition)
    }
  }, [open])

  return (
    <ModalWrapper $open={internalOpen} onClick={handleClick}>
      <ModalContent
        id="modal-content"
        ref={modalRef}
        $open={internalOpen}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {props.children}
      </ModalContent>
    </ModalWrapper>
  )
}

const ModalWrapper = styled.div<{ $open: boolean }>`
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  transition: 0.2s;

  ${(props) =>
    props.$open &&
    `
      opacity: 1;
      pointer-events: all;
  `}
`

const ModalContent = styled.div<{ $open: boolean }>`
  width: 1000px;
  margin: 0 40px;
  border-radius: 10px;
  background-color: white;
  transform: scale(0.2);
  transition: transform 0.2s;

  ${(props) => props.$open && 'transform: scale(1);'}
`

export default GenericModal
