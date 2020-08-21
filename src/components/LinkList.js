import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

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


  render() {

    return (
      <Query query={FEED_QUERY}>

        {({ loading, error, data }) => {
          if (loading) return <div>Fetching</div>
          // loading: Is true as long as the request is still ongoing and the response hasn’t been received.
          if (error) return <div>Error</div>
          // error: In case the request fails, this field will contain information about what exactly went wrong.
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
