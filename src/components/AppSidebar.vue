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

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Inbox",
        url: "#",
        icon: Inbox,
    },
    {
        title: "Calendar",
        url: "#",
        icon: Calendar,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
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
                    <SidebarMenu>
                        <SidebarMenuItem v-for="item in items" :key="item.title">
                            <SidebarMenuButton asChild>
                                <div>
                                    <component :is="item.icon" />
                                    <span>{{ item.title }}</span>
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>