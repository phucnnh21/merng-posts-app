const Post = require('../../models/Post');
const checkAuth = require('../../utils/authenticators');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(parent, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (!post) {
                    throw new Error('Post not found');
                }

                return post;
            } catch (err) {
                throw new Error(err);
            }
        }
    },

    Mutation: {
        async createPost(parent, { body }, context) {
            const user = checkAuth(context);

            if (body.trim() === '') {
                throw new Error('Post must not be empty');
            }

            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
                comments: [],
                likes: []
            });

            const post = await newPost.save();

            // context.pubsub.publish('NEW_POST', {
            //     newPost: post
            // });

            return post;
        },

        async deletePost(parent, { postId }, context) {
            const user = checkAuth(context);

            try {
                const post = await Post.findById(postId);

                if (user.username === post.username) {
                    await post.delete();
                    return 'Post deleted successfully';
                } else {
                    throw new AuthenticationError('Action not allowed');
                }
            } catch (err) {
                throw new Error(err);
            }
        },

        likePost: async (parent, { postId }, context) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (!post) {
                throw new UserInputError('Post not found');
            }

            if (post.likes.find(l => l.username === username)) {
                // Unlike
                post.likes = post.likes.filter(l => l.username !== username);
            } else {
                // Like
                post.likes.push({
                    username,
                    createdAt: new Date().toISOString()
                });
            }

            await post.save();

            return post;
        }
    },

    // Subscription: {
    //     newPost: {
    //         subscribe: (_, __, { pubsub }) => {
    //             pubsub.asyncIterator(['NEW_POST'])
    //         }
    //     }
    // }
}