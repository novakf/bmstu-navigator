import { Button, Select, message } from "antd"
import { FC } from "react"
import styled from "styled-components"
import {
  setActiveRouteAction,
  setRouteFromAction,
  setRouteToAction,
  useRouteFrom,
  useRouteTo,
} from "../../state/viewer"
import { useDispatch } from "react-redux"
import { useUoHolders, useUoItems, useUoLinks } from "../../state/editor/slice"
import { isSearchable } from "../../utils"
import { WeightedGraph } from "../../dijkstra"
import { Link } from "../../interfaces"
import { DefaultOptionType, FilterFunc } from "rc-select/lib/Select"

const textTypeMapper: Record<string, string> = {
  auditorium: "аудитория",
  ladder: "лестница",
}

export const RouteToolbar: FC = () => {
  const dispatch = useDispatch()
  const uoItems = useUoItems()
  const uoLinks = useUoLinks()
  const uoHolders = useUoHolders()
  const routeFrom = useRouteFrom()
  const routeTo = useRouteTo()

  const uoItemsSearchable = Object.keys(uoItems)
    .map((key) => uoItems[key])
    .filter(isSearchable)

  const searchableOptions = uoItemsSearchable.map((item) => {
    return {
      label: `${item.name} (${textTypeMapper[item.type]})`,
      value: item.id,
    }
  })

  const buildRoute = () => {
    if (!routeFrom || !routeTo) return

    const firstFromPoint = uoHolders[routeFrom]?.[0]
    const firstToPoint = uoHolders[routeTo]?.[0]

    const graph = new WeightedGraph()
    const clonedUoLinks = structuredClone(uoLinks)

    Object.keys(clonedUoLinks).forEach((key) => {
      const links = clonedUoLinks[key]

      const graphNodes = links.map((link: Link) => ({
        node: link.id,
        weight: link.len,
      }))

      graph.adjacencyList[key] = graphNodes
    })
    const pointIds = graph.Dijkstra(firstFromPoint, firstToPoint)

    dispatch(setActiveRouteAction({ pointIds }))
  }

  const clearRoute = () => {
    dispatch(setRouteFromAction(null))
    dispatch(setRouteToAction(null))
    dispatch(setActiveRouteAction(null))
  }

  const changeRouteEdge = (value: string, forRouteTo: boolean) => {
    if (forRouteTo) {
      dispatch(setRouteToAction(value))
    } else {
      dispatch(setRouteFromAction(value))
    }
  }

  const filterOption: FilterFunc<DefaultOptionType> = (inputValue, option) => {
    if (!option || !option.label) return false

    return !!~option.label.toString().indexOf(inputValue)
  }

  return (
    <Container>
      <StyledSelect
        options={searchableOptions}
        filterOption={filterOption}
        // @ts-ignore
        onChange={(value: string) => changeRouteEdge(value, false)}
        value={routeFrom}
        showSearch
        allowClear
      />
      <StyledSelect
        options={searchableOptions}
        filterOption={filterOption}
        // @ts-ignore
        onChange={(value: string) => changeRouteEdge(value, true)}
        value={routeTo}
        showSearch
        allowClear
      />
      <Button onClick={buildRoute} disabled={!routeFrom || !routeTo}>
        Построить
      </Button>
      <Button onClick={clearRoute} disabled={!routeFrom && !routeTo}>
        Очистить
      </Button>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  position: absolute;
  z-index: 100;
  left: 20px;
  top: 20px;
  gap: 10px;
`

const StyledSelect = styled(Select)`
  width: 200px;
`
