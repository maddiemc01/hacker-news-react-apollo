import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`
const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

export const FEED_QUERY = gql`
{
  feed {
    links {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
}
`
// create the JavaScript constant called FEED_QUERY that stores the query.
// The gql function is used to parse the plain string that contains the GraphQL code.

class LinkList extends Component {
  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY })
    // eading the current state of the cached data for the FEED_QUERY from the store
    const votedLink = data.feed.links.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes
    // retrieving the link that the user just voted for from that list.
    // You’re also manipulating that link by resetting its votes to the votes that were just returned by the server
    store.writeQuery({ query: FEED_QUERY, data })
    // take the modified data and write it back into the store
  }

  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document: NEW_LINKS_SUBSCRIPTION,
      // document: This represents the subscription query itself.
      // In your case, the subscription will fire every time a new link is created.
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink
        const exists = prev.feed.links.find(({ id }) => id === newLink.id);
        if (exists) return prev;

        return Object.assign({}, prev, {
          feed: {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __typename: prev.feed.__typename
          }
        })
      }
    })
  }
  // updateQuery: Similar to cache update prop, this function allows you to determine how the store should be updated with the information that was sent by the server after the event occurred.
  // In fact, it follows exactly the same principle as a Redux reducer: It takes as arguments the previous state (of the query that subscribeToMore was called on) and the subscription data that’s sent by the server.
  // You can then determine how to merge the subscription data into the existing state and return the updated data.
  // All you’re doing inside updateQuery is retrieving the new link from the received subscriptionData, merging it into the existing list of links and returning the result of this operation.

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  render() {

    return (
      <Query query={FEED_QUERY}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Fetching</div>
          // loading: Is true as long as the request is still ongoing and the response hasn’t been received.
          if (error) return <div>Error</div>
          // error: In case the request fails, this field will contain information about what exactly went wrong.

          this._subscribeToNewLinks(subscribeToMore)
          // using subscribeToMore received as prop into the component’s render prop function.
          // Calling _subscribeToNewLinks with its respective subscribeToMore function you make sure that the component actually subscribes to the events.
          // This call opens up a websocket connection to the subscription server
          this._subscribeToNewVotes(subscribeToMore)

          const linksToRender = data.feed.links
          // data: This is the actual data that was received from the server. It has the links property which represents a list of Link elements.
          return (
            <div>
              {linksToRender.map((link, index) => (
                <Link
                  key={link.id}
                  link={link}
                  index={index}
                  updateStoreAfterVote={this._updateCacheAfterVote}
                />
              ))}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default LinkList
