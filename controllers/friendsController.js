const mongoose = require('mongoose')
const User = require('../models/User')
const { getUserId } = require('./functions')

module.exports.friends_get = async (req, res) => {
    const userId = getUserId(req.cookies.jwt)

    const { name:userName, friends, friendRequests } = await User.findById(userId)

    const friendsData = []
    const friendRequestsData = []

    for (let friendId of friends) {
        const { _id, name } = await User.findById(friendId)
        friendsData.push({
            id : _id,
            name
        })
    }
    for (let strangerId of friendRequests) {
        const { _id, name } = await User.findById(strangerId)
        friendRequestsData.push({
            id : _id,
            name
        })
    }

    res.render('friends', {
        title: `Friends (${userName})`,
        layout: 'layouts/dashboardLayout.ejs',
        friends : friendsData,
        friendRequests: friendRequestsData,
        userId
    })
}

module.exports.sendRequest_post = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { id:receiverId } = req.body

        if (userId === receiverId) {
            return res.status(400).json({input: 'The entered ID is the same as your ID.'})
        }
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({input: 'The entered ID is not a valid ID.'})
        }
        if (!await User.exists({_id : receiverId})) {
            return res.status(400).json({input: 'There are no users with this ID.'})
        }

        const { friends } = await User.findById(userId)
        if (friends.indexOf(receiverId) !== -1) {
            return res.status(400).json({input: 'You are already friend with this user.'})
        }

        const { friendRequests } = await User.findById(receiverId)

        if (friendRequests.indexOf(userId) !== -1) {
            return res.status(400).json({input: 'You have already send a request to this user.'})
        }

        friendRequests.push(userId)

        await User.findByIdAndUpdate(receiverId, { friendRequests })

        res.status(200).end()

    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.acceptRequest_post = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { id:strangerId } = req.body
        const { friends:userFriends, friendRequests } = await User.findById(userId)
        const { friends:friendFriends } = await User.findById(strangerId)

        // Removing from friend requests
        friendRequests.splice(friendRequests.indexOf(strangerId), 1)

        // Adding friend to the user
        userFriends.push(strangerId)

        // Adding friend to the friend
        friendFriends.push(userId)

        // Saving to the database
        await User.findByIdAndUpdate(userId, {
            friends: userFriends, 
            friendRequests
        })
        await User.findByIdAndUpdate(strangerId, {
            friends: friendFriends
        })

        res.status(200).end()

    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.rejectRequest_post = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { id:strangerId } = req.body
        const { friendRequests } = await User.findById(userId)

        friendRequests.splice(friendRequests.indexOf(strangerId), 1)

        await User.findByIdAndUpdate(userId, { friendRequests })

        res.status(200).end()

    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}

module.exports.friends_delete = async (req, res) => {
    try {
        const userId = getUserId(req.cookies.jwt)
        const { id:friendId } = req.body
        const { friends: userFriends } = await User.findById(userId)
        const { friends: friendFriends } = await User.findById(friendId)

        userFriends.splice(userFriends.indexOf(friendId), 1)
        friendFriends.splice(friendFriends.indexOf(userId), 1)

        await User.findByIdAndUpdate(userId, { friends: userFriends })
        await User.findByIdAndUpdate(friendId, { friends: friendFriends })
        
        res.status(200).end()

    } catch (err) {
        console.error(err)
        res.status(500).end()
    }
}