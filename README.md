# Take My Stuff, Please

**Table of Contents**

- Why This Web App?
- Tech Stack
- Engineering Challenges

## Why This Web Application?

At the end of August this year, I am leaving my coffee shop gig and hometown in the hope of more closely following my life purpose:

    Make cool things and build deep friendships.

I decided, as this is a big life event for myself, that I would get rid of most my stuff, and put the sentimental (but overly large) stuff in storage until I settle down somewhere. That means that I need to get rid of quite a bit of stuff. Garage sales are great, but I personally am lazy when it comes to organizing and passionate when it comes to website development. So I figured it would be more fun and career focused to just code a 'give away app' for my unwanted items!

Getting rid of superfluous life artifacts helps me in several ways:

1. Clears my mind of projects that are not a priority in my life.
2. Practices 'gift giving' to people I care about.
3. Allows me to travel lightly without worrying about what I may have left behind.

## Tech Stack

- [NextJS](https://nextjs.org/) (Frontend: React, Backend: NextJS API Routes)
- Styling: [TailwindCSS](https://tailwindcss.com/)
- Database: [MongoDB Atlas](https://www.mongodb.com/)
- Image Storage: [AWS S3](https://aws.amazon.com/pm/serv-s3/)
- Deployment: [Vercel](https://vercel.com/)

This is one of the two tech stacks I have been focusing on the last couple years. I wanted to code this app very fast since I was planning on moving out of my house in less than two months, so it made sense to go with what I'm comfortable using.

## Engineering Challenges:

**Challenge 1: Learning the MediaDevices JS API**

I wanted to be able to invite a friend over to help me catalog everything. With multiple people taking pictures of my stuff at the same time, I could catalog all my personal items much faster. However, I did not want to force my friend to take a picture with their phone's native camera app, then have to open my website and upload the picture. That process is too involved. Instead, I thought it would be nice to have the camera functionality baked into the web app so that we never have to leave the app to catalog anything.

In order to do this I needed to make use of the MediaDevices Javascript API. The particular function I needed was

    MediaDevices.getUserMedia()

**Challenge 2: Implementing Secure User Sessions**
