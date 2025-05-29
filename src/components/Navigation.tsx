import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>About LoopBurn</NavigationMenuLink>
            <NavigationMenuLink>Documentation</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        // ... existing code ...
      </NavigationMenuList>
    </NavigationMenu>
  )
}