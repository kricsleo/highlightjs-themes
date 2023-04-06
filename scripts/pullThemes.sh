# clean up
rm -rf tmp/themes
mkdir -p tmp/themes

echo "> Getting VS Code themes"
if [ ! -d tmp/vscode ]; then
  git clone https://github.com/microsoft/vscode.git tmp/vscode --depth=1 --single-branch
else
  (cd tmp/vscode && git checkout . && git pull)
fi
cp tmp/vscode/extensions/theme-*/themes/*.json tmp/themes
npx tsx scripts/themes/processVSCThemes.ts
echo "> Done getting VS Code themes"

echo "> Getting themes from GitHub"
npx tsx scripts/themes/pullThemesFromGitHub.ts
echo "> Done getting themes from GitHub"

echo "> Getting themes from VS Code marketplace"
npx tsx scripts/themes/pullThemesFromMarketplace.ts
echo "> Done getting themes from VS Code marketplace"

echo "> Normalizing themes"
npx tsx scripts/themes/normalizeThemePaths.ts
echo "> Done normalizing themes"

echo "> Copying themes"
cp tmp/themes/*.json themes/
echo "> Done copying themes"

echo "> Generating highlightjs themes"
npx tsx scripts/themes/normalizeThemePaths.ts
echo "> Done generating highlightjs themes"

# echo "> Updating source files"
# npx esno scripts/themes/updateThemeSrc.ts
# echo "> Done updating source files"

# echo "> Formatting theme files"
# npx prettier --write packages/shiki/themes/*
# echo "> Done formatting theme files"

echo "> All done"
