<script setup lang="ts">
import { ref, type Ref, onMounted, markRaw } from 'vue'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import { VueFlow, useVueFlow, Panel } from '@vue-flow/core'
import AppSidebar from './components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import DropzoneBackground from './components/custom-flow/DropzoneBackground.vue'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from './components/ui/menubar';
import useDragAndDrop from './useDnD'

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import CustomFlow from './components/custom-flow/CustomFlow.vue'

const { onConnect, addEdges, addNodes, onNodeDragStop, getEdges, onNodeDragStart, onPaneContextMenu } = useVueFlow()


const { onDrop } = useDragAndDrop()

const width = window.innerWidth;

const height = window.innerHeight;

const selectT = () => {
  const node = {
    id: Math.random().toString(),
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    label: 'Random Node',
  };

  addNodes(node)
}

const contextMenuDiv: Ref<HTMLElement | null> = ref(null)


const onPaneContext = (e: MouseEvent) => {
  const contextEvent = new MouseEvent('contextmenu', {
    bubbles: true,             // Makes sure the event bubbles up
    cancelable: true,          // Allows the event to be cancelable
    view: window,              // The window object
    clientX: e.clientX,        // Reuse the X coordinate from the existing event
    clientY: e.clientY,        // Reuse the Y coordinate from the existing event
    button: 2                  // Typically, right-click is button 2
  });

  (contextMenuDiv.value)?.dispatchEvent(contextEvent);
}

onPaneContextMenu((e) => {
  onPaneContext(e);
})

</script>

<template>
  <SidebarProvider :style="{ width: width + 'px', height: height + 'px' }">
    <AppSidebar />
    <main @drop="onDrop" class="h-full w-full flex">
      <ContextMenu>
        <ContextMenuTrigger class="w-full h-full fixed -z-0">
          <div ref="contextMenuDiv">
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem inset>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>
              More Tools
            </ContextMenuSubTrigger>
            <ContextMenuSubContent class="w-48">
              <ContextMenuItem>
                Save Page As...
                <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem :model-value="true">
            Show Bookmarks Bar
            <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup model-value="pedro">
            <ContextMenuLabel inset>
              People
            </ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">
              Colm Tuite
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
      <CustomFlow>
        <template #panel>
          <SidebarTrigger />
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger class="gap-x-1">Create
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem @select="selectT">
                  New Plan
                </MenubarItem>
                <MenubarItem>New Addon</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>New Feature</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>New Feature Group</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger class="gap-x-1">
                Save
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </template>
      </CustomFlow>
    </main>
  </SidebarProvider>
</template>
