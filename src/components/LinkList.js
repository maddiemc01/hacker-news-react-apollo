import React, { Component } from 'react'
import Link from './Link'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

class LinkList extends Component {
  render() {
    const FEED_QUERY = gql`
      {
        feed {
          links {
            id
            createdAt
            url
            description
          }
        }
      }
    `
    // create the JavaScript constant called FEED_QUERY that stores the query.
    // The gql function is used to parse the plain string that contains the GraphQL code.
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
              {linksToRender.map(link => <Link key={link.id} link={link} />)}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default LinkList
