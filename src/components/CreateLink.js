import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

class CreateLink extends Component {
  state = {
    description: '',
    url: '',
  }

  render() {
    const POST_MUTATION = gql`
      mutation PostMutation($description: String!, $url: String!) {
        post(description: $description, url: $url) {
          id
          createdAt
          url
          description
        }
      }
    `
    // create the JavaScript constant called POST_MUTATION that stores the mutation.

    const { description, url } = this.state
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        {/* pass description and url states as variables prop. */}
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onCompleted={() => this.props.history.push('/')}>
        {/* {() => (
          <button onClick={`... you'll implement this 🔜`}>
            Submit
          </button>
      wrap the button element as render prop function result with <Mutation /> component passing POST_MUTATION as prop.
        )} */}
        {postMutation => <button onClick={postMutation}>Submit</button>}
      </Mutation>
      </div>
    )
  }
}

export default CreateLink