<script setup lang="ts">
import { ref, type Ref, } from 'vue'
import { useVueFlow, } from '@vue-flow/core'
import AppSidebar from './components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from './components/ui/sonner'
import { Moon, Info } from 'lucide-vue-next';
import DropzoneBackground from './components/custom-flow/DropzoneBackground.vue'
import { useColorMode } from '@vueuse/core'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
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
import common from './lib/common'
import Button from './components/ui/button/Button.vue';
import Tree from './lib/tree';

const { onConnect, addEdges, addNodes, onNodeDragStop, getEdges, onNodeDragStart, onPaneContextMenu } = useVueFlow()


const { onDrop } = useDragAndDrop()

const width = window.innerWidth;

const height = window.innerHeight;


const addNode = (type: string) => {
  const tree = Tree.instance();
  const id = tree?.getNodes().length ?? Math.random() * 500;
  const node = {
    id: (id + 1).toString(),
    position: { x: Math.random() * 500, y: Math.random() * 500 },
    label: 'Random Node',
    type: type,
  };

  console.log(node)
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

const mode = useColorMode()
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
        <template #panel-right>
          <div class="flex items-center gap-x-2 p-0.5 bg-background border rounded-lg">
            <Button :variant="'ghost'" @click="mode = mode === 'light' ? 'dark' : 'light'">
              <Moon :size="common.iconSize" />
            </Button>
            <Button :variant="'ghost'">
              <Info :size="common.iconSize" />
            </Button>
          </div>
        </template>
        <template #panel-left>
          <SidebarTrigger />
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger class="gap-x-1">Create
              </MenubarTrigger>
              <MenubarContent>
                <MenubarSub>
                  <MenubarSubTrigger>Node</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem @select="addNode('plan')">
                      New Plan
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('addon')">New Addon</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('feature')">New Feature</MenubarItem>
                    <!-- <MenubarSeparator /> -->
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSub>
                  <MenubarSubTrigger>Action</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarItem @select="addNode('featureCondition')">Feature Condition</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('setMeteredFeature')">Set Metered Feature</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('chargeSpecificAmountAtEachCondition')">Charge Specified Amount At
                      Each Condition</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('adjustAmount')">Adjust Amount</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('letCustomerSelectQuantity')">Let Customer Select Quantity
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem @select="addNode('limitRequests')">Limit Requests
                    </MenubarItem>
                  </MenubarSubContent>
                </MenubarSub>
              </MenubarContent>
            </MenubarMenu>

            <MenubarMenu>
              <MenubarTrigger class="gap-x-1">
                Save
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger class="gap-x-1">
                Import
              </MenubarTrigger>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger class="gap-x-1">
                Export
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </template>
      </CustomFlow>
      <Toaster />
    </main>
  </SidebarProvider>
</template>
