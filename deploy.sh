if [ "$1" != "test" ] && [ "$1" != "next" ] && [ "$1" != "production" ]; then
  echo "You need to pass test, next or production as parameter of this script";
  exit 1;
fi

echo "Deploying  reactjs website for the $1 environment..."

if [ ! -d "dist" ]; then
  echo "Creating dist/ folder..."
  mkdir dist
fi

echo "Cleaning previous changes..."
git checkout .
echo "Fetching updates..."
git pull
echo "Installing dependencies..."
npm install
echo "Building the bundles..."
REACT_APP_ENV="$1" npm run build

echo "Copying the files to the dist folder..."
cp -rf build/* dist/

echo "Killing the pm2 instance..."
pm2 delete story
echo "Starting the pm2 instance..."
pm2 --name="traking" start pushstate-server -- dist/ 8081

echo "traking reactjs website deployed successfully"