rm(list = ls())

library(scholar)
library(dplyr)


# 1. get all citations from Rob & Paul
raw_dat <- rbind(
  scholar::get_publications(id = "nEJ0x6IAAAAJ"),  # Rob
  scholar::get_publications(id = "Kjmv4E4AAAAJ"),  # Paul
  scholar::get_publications(id = "z6MCSFUAAAAJ")   # Wael
  )

# only keep distinct publications with a journal and a year:
final_list <- raw_dat %>% 
  arrange(-cites) %>%
  distinct(title, .keep_all = T) %>%
  select(title, author, journal, year, cites) %>%
  filter(journal != "" & !is.na(year)) %>%
  #distinct(title, author, year, cites, .keep_all = FALSE) %>%
  arrange(-cites, -year) %>%
  filter(year >= 2019 & cites > 1)

# output to Kable
kableExtra::kbl(x = final_list,
                col.names = c("Title", "Authors", "Journal", "Year", "Citations"),
                format = "pipe",
                caption = paste0("Recent publications from Dark Peak Analytics.")
                ) %>%

kableExtra::add_footnote(label = paste0("Last updated: ", Sys.Date()), notation = "none") %>%
  kableExtra::save_kable(file = "temp.md")

