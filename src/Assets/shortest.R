# Install and load required packages
install.packages("ggplot2")
install.packages("maps")
install.packages("jsonlite")  # For handling JSON data
library(ggplot2)
library(maps)
library(jsonlite)

# Get world map data
world_map <- map_data("world")

# Plot the world map
ggplot() +
  geom_map(data = world_map, map = world_map,
           aes(x = long, y = lat, map_id = region),
           fill = "lightblue", color = "black") +
  theme_void()
