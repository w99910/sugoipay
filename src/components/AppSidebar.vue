<script setup lang="ts">
import { Calendar, Home, Inbox, Settings } from "lucide-vue-next"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import SearchNodes from "./custom-flow/SearchNodes.vue";

import { Skeleton } from '@/components/ui/skeleton'

// Menu items.
const items = [
    {
        id: '',
        name: '',
        type: '',
    },
    {
        id: '',
        name: '',
        type: '',
    },
    {
        id: '',
        name: '',
        type: '',
    },
    {
        id: '',
        name: '',
        type: '',
    },
    {
        id: '',
        name: '',
        type: '',
    },
];
</script>

<template>
    <Sidebar variant="floating">
        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupLabel>SugoiPay</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SearchNodes class="my-2 w-full" />
                    <SidebarMenu class="gap-y-3 mt-4">
                        <SidebarMenuItem v-for="item in items" :key="item.id">
                            <SidebarMenuButton asChild>
                                <Skeleton class="w-full h-12" />
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>