// Centralized color mapping for engineers to ensure consistency
const engineerColors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ]
  
  // Create a stable color mapping based on engineer ID
  const colorMap = new Map<string, string>()
  
  export function getEngineerColor(engineerId: string): string {
    if (!colorMap.has(engineerId)) {
      const index = colorMap.size % engineerColors.length
      colorMap.set(engineerId, engineerColors[index])
    }
    return colorMap.get(engineerId)!
  }
  
  export function getEngineerInitials(name: string): string {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  