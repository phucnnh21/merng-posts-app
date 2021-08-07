const { UserInputError, AuthenticationError } = require('apollo-server');

const checkAuth = require('../../utils/authenticators');
const Post = require('../../models/Post');

module.exports = {
    Mutation: {
        createComment: async (parent, { postId, body }, context) => {
            const { username } = checkAuth(context);

            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not empty'
                    }
                })
            }

            const post = await Post.findById(postId);

            if (!post) {
                throw new UserInputError('Post not found');
            }

            post.comments.unshift({
                body,
                username,
                createdAt: new Date().toISOString()
            });

            await post.save();
            return post;
        },

        deleteComment: async (parent, { postId, commentId }, context) => {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);

            if (!post) {
                throw new UserInputError('Post not found');
            }

            const commentIndex = post.comments.findIndex(c => c.id === commentId);

            if (post.comments[commentIndex].username === username) {
                post.comments = post.comments.filter(comment => comment.id !== commentId);
                await post.save();
                return post;
            } else {
                throw new AuthenticationError('Action denied!');
            }
        }
    }
}