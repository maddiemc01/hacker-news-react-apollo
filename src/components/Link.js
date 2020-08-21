import React, { Component } from 'react'

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

class Link extends Component {
  render() {
    const VOTE_MUTATION = gql`
      mutation VoteMutation($linkId: ID!) {
        vote(linkId: $linkId) {
          id
          link {
          id
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

    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
      <div className="flex mt2 items-start">
        <div className="flex items-center">
          <span className="gray">{this.props.index + 1}.</span>
          {authToken && (
            <Mutation
              mutation={VOTE_MUTATION}
              variables={{ linkId: this.props.link.id }}
              update={(store, { data: { vote } }) =>
                this.props.updateStoreAfterVote(store, vote, this.props.link.id)
              }
              // update function that you’re passing as prop to the <Mutation /> component will be called directly after the server returned the response.
              // It receives the payload of the mutation (data) and the current cache (store) as arguments. You can then use this input to determine a new state for the cache
            >
              {voteMutation => (
                <div className="ml1 gray f11" onClick={voteMutation}>
                  ▲
                </div>
              )}
            </Mutation>
          )}
          {/* adding the ability to call the voteMutation inside our functional component by using the <Mutation /> component
          (also we’re passing VOTE_MUTATION and link.id as props). */}
        </div>
        <div className="ml1">
          <div>
            {this.props.link.description} ({this.props.link.url})
          </div>
          <div className="f6 lh-copy gray">
            {this.props.link.votes.length} votes | by{' '}
            {this.props.link.postedBy
              ? this.props.link.postedBy.name
              : 'Unknown'}{' '}
            {timeDifferenceForDate(this.props.link.createdAt)}
            {/*  timeDifferenceForDate gets passed the createdAt information for each link.
            The function will take the timestamp and convert it to a string that’s more user friendly, e.g. "3 hours ago". */}
          </div>
        </div>
      </div>
    )
  }
}

export default Link