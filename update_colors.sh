#!/bin/bash
find src -type f -name "*.tsx" -exec sed -i '' -e 's/bg-\[#14B8A6\]/bg-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/text-\[#14B8A6\]/text-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/border-\[#14B8A6\]/border-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/ring-\[#14B8A6\]/ring-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/from-\[#14B8A6\]/from-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/to-\[#14B8A6\]/to-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/via-\[#14B8A6\]/via-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/accent-\[#14B8A6\]/accent-primary/g' {} +
find src -type f -name "*.tsx" -exec sed -i '' -e 's/border-t-\[#14B8A6\]/border-t-primary/#!/bin/bash
find src -type f -name "*.tsx" -exec sed  -find src -"find src -type f -name *.tsx -exec sed -i "''" -e "'s/text-\[#14B8A6\]/text-primary/g'" sfind src -type f -e "'s/hover:text-\[#0D9488\]/hover:text-primary\/90/g'" {} +