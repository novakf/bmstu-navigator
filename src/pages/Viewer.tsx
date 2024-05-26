import React, { FC, useEffect, useState } from "react"
import styled from "styled-components"
import { FloorChoose } from "../components/viewer/floor-choose"
import { Scheme } from "../components/viewer/scheme"
import { useDispatch } from "react-redux"
import { initEditor } from "../state/editor/slice"
import { AppDispatch } from "../state"
import { RouteToolbar } from "../components/viewer/route-toolbar"
import { RouteStepper } from "../components/viewer/route-stepper"

export const Viewer: FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isInit, setIsInit] = useState(false)

  useEffect(() => {
    dispatch(initEditor())
    setIsInit(true)
  }, [])

  if (!isInit) return null

  return (
    <Container>
      <RouteToolbar />
      <Scheme />
      <FloorChoose />
      <RouteStepper />
    </Container>
  )
}

const Container = styled.div``
