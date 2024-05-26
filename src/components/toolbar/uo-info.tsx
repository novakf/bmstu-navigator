import { DeleteOutlined, InfoOutlined } from "@ant-design/icons"
import { Button, Drawer, List, Modal } from "antd"
import { FC, useState } from "react"
import {
  removeObjectFromUoHoldersAction,
  removeObjectFromUoItemsAction,
  removeObjectFromUoLinksAction,
  useUoItems,
} from "../../state/editor/slice"
import { useDispatch } from "react-redux"
import styled, { isStyledComponent } from "styled-components"

export const UoInfo: FC = () => {
  const dispatch = useDispatch()
  const uoItems = useUoItems()
  const [isInfoOpen, setIsInfoOpen] = useState(false)

  const openInfo = () => {
    setIsInfoOpen(true)
  }

  const deleteItem = (id: string) => {
    dispatch(removeObjectFromUoItemsAction({ id }))
    dispatch(removeObjectFromUoLinksAction({ id }))
    dispatch(removeObjectFromUoHoldersAction({ id }))
  }

  const hoverItem = (id: string) => {
    const svgId = uoItems[id].svgId
    const svgEl = document.getElementById(svgId)

    if (!svgEl) return

    svgEl.style.stroke = "green"
    svgEl.style.strokeWidth = "2px"
  }

  const unhoverItem = (id: string) => {
    const svgId = uoItems[id].svgId
    const svgEl = document.getElementById(svgId)

    if (!svgEl) return

    svgEl.style.stroke = ""
    svgEl.style.strokeWidth = ""
  }

  return (
    <>
      <Drawer
        open={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        width={350}
        placement={"left"}
        styles={{ mask: { background: "transparent", pointerEvents: "none" } }}
      >
        <List>
          {Object.keys(uoItems).map((key) => (
            <ListItem
              onMouseEnter={() => hoverItem(key)}
              onMouseLeave={() => unhoverItem(key)}
              key={key}
              actions={[
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => deleteItem(key)}
                />,
              ]}
            >
              {uoItems[key].name} ({uoItems[key].type}) ({uoItems[key].floor}) (
              {uoItems[key].id})
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Button icon={<InfoOutlined />} onClick={openInfo} />
    </>
  )
}

const ListItem = styled(List.Item)`
  transition: 0.2s;
  border-radius: 8px;
  padding: 12px 8px !important;
  display: flex !important;

  &:hover {
    background: lightgrey;
  }
`
