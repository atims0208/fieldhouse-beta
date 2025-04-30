import CategoryCard from "@/components/category-card"

export default function CategoriesPage() {
  // Mock categories data
  const categories = [
    {
      id: "cat-1",
      name: "Basketball",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 45230,
    },
    {
      id: "cat-2",
      name: "Football",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 38750,
    },
    {
      id: "cat-3",
      name: "Baseball",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 21540,
    },
    {
      id: "cat-4",
      name: "Soccer",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 19870,
    },
    {
      id: "cat-5",
      name: "Volleyball",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 12450,
    },
    {
      id: "cat-6",
      name: "Hockey",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 9870,
    },
    {
      id: "cat-7",
      name: "Tennis",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 8540,
    },
    {
      id: "cat-8",
      name: "Golf",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 7650,
    },
    {
      id: "cat-9",
      name: "Swimming",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 6320,
    },
    {
      id: "cat-10",
      name: "Track & Field",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 5430,
    },
    {
      id: "cat-11",
      name: "Esports",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 15670,
    },
    {
      id: "cat-12",
      name: "Fitness",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 9870,
    },
    {
      id: "cat-13",
      name: "Wrestling",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 4320,
    },
    {
      id: "cat-14",
      name: "Boxing",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 7650,
    },
    {
      id: "cat-15",
      name: "MMA",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 8970,
    },
    {
      id: "cat-16",
      name: "Lacrosse",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 3210,
    },
    {
      id: "cat-17",
      name: "Rugby",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 4560,
    },
    {
      id: "cat-18",
      name: "Cycling",
      image: "/placeholder.svg?height=300&width=240",
      viewerCount: 2340,
    },
  ]

  return (
    <div className="container px-4 py-6 md:px-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-fhsb-cream">Categories</h1>
        <p className="text-muted-foreground mt-1">Browse streams by category</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  )
}
