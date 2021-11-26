const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth')

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
      if(context.user) {
        return User.findOne({_id: context.user._id}).select("-__v -password")
      } throw new AuthenticationError ("You are not logeed in")
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { user, token };
    },
    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user with this email found!');
        }
  
        const pass = await user.isCorrectPassword(password);
  
        if (!pass) {
          throw new AuthenticationError('Incorrect password!');
        }
  
        const token = signToken(user);
        return { token, user };
    },
    saveBook: {

    },
    removeBook: {

    },
  },
};

module.exports = resolvers;