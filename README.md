# Take My Stuff, Please

**Table of Contents**

- Why This Web App?
- Tech Stack
- Engineering Challenges
- Where Do I Go From Here?

## Why This Web Application?

At the end of August this year, I am leaving my coffee shop gig and hometown in the hope of more closely following my life purpose:

    Make cool things and build deep friendships.

I decided, as this is a big life event for myself, that I would get rid of most my stuff, and put the sentimental (but overly large) stuff in storage until I settle down somewhere. Garage sales are great, but I personally am lazy when it comes to organizing and passionate when it comes to website development. So I figured it would be more fun and career focused to just code a 'give away app' for my unwanted items!

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

At first I thought I could perhaps store phone numbers in an http-only cookie containing a encrypted jwt that expires after an hour. While it might be concerning that sensitive data is being stored locally, I was not entirely sure what difference it would make to store the data in a database, beside that an attacker could get access to everything at once if they managed to hack the app (as opposed to just the number stored locally in the auth token).

Then I realized! I have to _contact all these people_ to get the items to them. So of course, I have to store their phone numbers centrally. Oops! Ahahaha.

So, I decided to create a 'users' collection where each document \_id is an encrypted phone number, and a claims array that contains all the object keys to images of the objects the user has claimed.

But! There was a slight problem with this auth flow as well. Since I was already storing the phone numbers (albeit encrypted) in a central database, there really is no need to also use those numbers as identification in jwt tokens per session. So I decided, in the end, that the backend user documents would follow this model:

    {
        _id: ObjectId, // randomly chosen per user
        phone: String // encrypted
        claims: Array<String> // list of aws s3 object keys
    }

Whenever a user makes their first claim per session, they are asked to provide their phone number. If the phone number does not exist, a new user document is added to the database. Then, they backend sets an http-only cookie containing a signed jwt that contains the user \_id. The \_id can be used in later requests to list all the user's claims.

## Challenge 3: Crypto.createCipheriv

This app stores phone numbers so that I can contact people who have claimed my random house items, so I needed to encrypt those numbers for safely. Javascript has Crypto.createCipheriv for that! It was pretty straight forward but I was slightly thrown off by the initialization vector the first couple times I read the documentation. From what I understand, the initialization vector acts similarly to a seed for a random generator, where it mapps each different random value per input value, depending on the initialization vector. This means that encrypting the word 'hello' with two different initialization vectors results in different results. I don't want my iv value to be random like examples suggest though, because my I will be encrypting and decrypting the same phone number across different sessions. So, I created my encryption function with an optional iv flag.

    export function encrypt(text, useIV = false) {
        /*
        iv is sed to ensure uniqueness of each encryption,
        but I will be using using Buffer.alloc(16) most
        the time, instead of randomBytes
        */
        const iv = useIV ? crypto.randomBytes(16) : Buffer.alloc(16);

        ...
    }

Embarrasingly, I was hung up on how Buffers work and why I kept getting 'error - RangeError: invalid key length' on this function call.

## Challenge 4: User API Routes

My first day of coding the users api I made it a little too complicated. The file based API routing looked something like this:

    users/
        addclaim.js
        claims.js
        create.js
        removeclaim.js
        session.js
        signin.js

I go exhausted pretty fast, but I was past my peak brain energy window for the day and was just mindlessly coding instead of thinking about what I was doing.

Later that night, after a bike ride, rest, and some food, I realized that the API could be _slightly_ simpler:

    users/
        addclaim.js
        removeclaim.js
        claims.js
        session.js
        signin.js // create and signin can be combined using upserts

Not a huge improvement, but it made me feel more at ease to get back to coding, I definitely felt like I was doing the same thing over and over again during my first attempt.

## Challenenge 5: Database Issues

I ran into some annoying problems due to the way I set up my database. Namely, I store the image keys on a collection, and I also store users (which have an array of claims to image keys) in another collection. AND, I decided (for some brain dead reason) to also have a 'claimedBy' field for each image key document that is claimed by a user. This means that everytime I delete or claim an image there are far too many operations happening on the database, and it also means that **I don't really have a single source or truth in my database**. Which in general is a red flag when coding any application, for the obvious complexity it causes when editing anything.

Add to this the fact that I was already storing the actual images in an s3 instance, and not the mongodb instance with the rest of this data, and I realized I probably need to do some rethinking on my database schema.

A solid answer, I think, is to just remove the claims array from user documents, and write a function that iterates of the s3ObjectData collection to determine what a singular user has claimed (this is actually easy with mongodb). So I changed the previous user document schema from this:

    {
        _id: ObjectId, // randomly chosen per user
        phone: String // encrypted
        claims: Array<String> // list of aws s3 object keys
    }

to this:

    {
        _id: ObjectId, // randomly chosen per user
        phone: String // encrypted
        // no claims! Claims are only recorded in item documents
    }

This made my code a lot simpler.

## Where I Go From Here

Some next logical steps for this application are the following:

- Integrate Stipe Payment Processing to turn it into a full fledged online store.
- Allow anybody to create user profiles for uploading and managing their own stuff.
- upgrade the user authorization using Auth0 or some other authorization service.
