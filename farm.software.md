# Barsoum Olives Data Tracker

I am an olive farmer and I have a small grove. I want to write a simple web application that helps me:
1. Log actions for tree
2. Log actions for oil processing batch
3. Log actions for pickling batch
4. Query this data in (v2)

Each log will have:
1. Date
2. Action
3. Properties (Associated with the action)

# Hosting

I want to host this application as a github page, and I want the application to read and write the data from/to a persistent store.
Provide all the code and README files to:
- FE: vite + tailwindcss + typescript
- BE: supabase + typescript (manage tables in (declarative database schemas)[https://supabase.com/docs/guides/local-development/declarative-database-schemas])

# We app pages
1. /trees
- list of all trees, with a map of the grove, and a button for each tree to view its logs
2. /tree/:treeId
- view logs for this tree
- add new log for this tree
3. /oil-processing-batches
- list of all oil processing batches
- can add new oil processing batch
4. /oil-processing-batch/:oilProcessingBatchId
- view logs for this oil processing batch
- add new log for this oil processing batch
5. /pickling-batches
- list of all pickling batches
- can add new pickling batch
6. /pickling-batch/:picklingBatchId
- view logs for this pickling batch
- add new log for this pickling batch

> Note: there should be a navigation bar at the top of the page to navigate between the top level pages (trees, oil processing batches, pickling batches)

# Tree Map and Properties

I provided you with an excel sheet that has an x in the location of every tree.
I want the we application to show each one of those trees as a button that I can click on to view the logs of this tree and add more logs.

I also want to add a few persistent properties to each tree:
1. variety: frontoyo | kalamata | jumbo kalamata | spanish queen | burnia
2. year planted: number
3. supplier: string


## Tree Log Actions

1. Pruning
- Vase shape: boolean
- Bushy shape: boolean
- Clear trunk: boolean
- Skirt: boolean
- High growing ends: boolean
- Wild shoots: boolean

2. Irrigation
- Number of drippers: Number
- Number of hours: number

3. Harvesting
[tree level]
- amount (kgs): number
- harvesting_profile_id: string

[harvesting profile]
- type: mechanical | manual
- contractor name: string [only if mechanical]
- price: number

4. Fertilizing [profile]
- Nitrogen: boolean
- Potassium: boolean
- Phosphore: boolean
- Borron: boolean
- Chicken maure: boolean
- lime: boolean
- gibsume: boolean

5. Treatment
- white oil: boolean
- other: string

6. Flowering
- percentage initial: number
- percentage remaining: number

7. weather profile
- frost: boolean
- rain: boolean
- temperature: number

## Tree Data entry

While data is always stored at a tree level, data entry can be done at one of 2 levels:
1. tree level [one to one relationship]
- I select the tree and enter the data for this tree only
2. profile level [one to many relationship]
- I crate a profile (e.g. for weather or harvesting) and enter the data then select all the tress that should receive this data, then the same data will be entered for each tree separately

# Oil processing batches
Every oil processing batch is a collection of trees that were harvested at the same time.
A batch has the following properties:
- trees: array of tree ids
- date 

## Oil processing batch actions
1. Transportation from grove to plant
- driver name: string
- price: number

2. Processing
- plant name: string
- notes: string
- price: number
- weight (kgs): number
- yield (liter): number
- percentage: number

3. Filtering
- plant name: string
- price: number
- notes: string

4. Transportation from plant to home
- driver name: string
- price: number

5. Bottling
- container volume (liter): number


# Pickling batches
Every pickling batch is a collection of trees that were harvested at the same time.
A batch has the following properties:
- trees: array of tree ids
- date 
- Variety
- Ripeness
- Notes: string
- Supplier: string
- Recipe
  - salt percentage: number
  - bruised: boolean
  - notes: string

# SQL tables
- Trees
- Pruning
- Irrigation
- Harvesting profile
- Fertilizing profile
- Treatment
- Flowering
- Weather profile
- Oil processing batch
- Transportation from grove to plant
- Processing
- Filtering
- Transportation from plant to home
- Bottling
- Pickling batch



