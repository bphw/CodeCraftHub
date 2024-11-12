##To run
1. Do `npm install`
2. generate random string for `JWT_SECRET` on `.env` with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
3. make sure `MONGO_URI` on `.env` something like `mongodb://{USER}:{PASSWORD}@{IP}}:{PORT}`. Find it on Skill Network Toolbox > Databases > MongoDB > Create