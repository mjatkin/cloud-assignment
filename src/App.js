import React, { useState, useReducer, useEffect } from 'react'
import { withAuthenticator} from '@aws-amplify/ui-react'
import { Storage, API, graphqlOperation } from 'aws-amplify'
import uuid from 'uuid/v4'
import { createUser as CreateUser } from './graphql/mutations'
import { listUsers } from './graphql/queries'
import { onCreateUser } from './graphql/subscriptions'
import config from './aws-exports'

const {
  aws_user_files_s3_bucket_region: region,
  aws_user_files_s3_bucket: bucket
} = config

const initialState = {
  users: []
}

function reducer(state, action) {
  switch(action.type) {
    case 'SET_USERS':
      return { ...state, users: action.users }
    case 'ADD_USER':
      return { ...state, users: [action.user, ...state.users] }
    default:
      return state
  }
}

function App() {
  const [file, updateFile] = useState(null)
  const [username, updateUsername] = useState('')
  const [state, dispatch] = useReducer(reducer, initialState)
  const [avatarUrl, updateAvatarUrl] = useState('')

  function handleChange(event) {
    const { target: { value, files } } = event
    const [image] = files || []
    updateFile(image || value)
  }

var currentKey

  async function fetchImage(key) {
    try {
      currentKey = key
      const imageData = await Storage.get(key)
      let a = document.getElementById('download')
      a.href = imageData
      updateAvatarUrl(imageData)
    } catch(err) {
      console.log('error: ', err)
    }

  }

  async function fetchUsers() {
    try {
     let users = await API.graphql(graphqlOperation(listUsers))
     users = users.data.listUsers.items
     dispatch({ type: 'SET_USERS', users })
    } catch(err) {
      console.log('error fetching users')
    }
  }

  async function createUser() {
    if (file) {
        const { name: fileName, type: mimeType } = file  
        const key = `job-${uuid()}${fileName}`
        //const key = `complete/${origkey.split('.')[0]}.mp4`
        const fileForUpload = {
            bucket,
            key,
            region,
        }
        const inputData = { username: fileName, avatar: fileForUpload }

        try {
          await Storage.put(key, file, {
            contentType: mimeType
          })
          await API.graphql(graphqlOperation(CreateUser, { input: inputData }))
          updateUsername('')
          console.log('successfully stored user data!')
        } catch (err) {
          console.log('error: ', err)
        }
    }
  }

  async function deleteVideo() {
   // const { name: fileName, type: mimeType } = file
    //const inputData = { username: fileName, avatar: fileForUpload }
    await Storage.remove(currentKey)
    console.log(currentKey)
    //await API.graphql(graphqlOperation(deleteUser, { input: inputData }))
  }


  useEffect(() => {
    fetchUsers()
    const subscription = API.graphql(graphqlOperation(onCreateUser))
      .subscribe({
        next: async userData => {
          const { onCreateUser } = userData.value.data
          dispatch({ type: 'ADD_USER', user: onCreateUser })
        }
      })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={styles.container}>
      <input
        label="File to upload"
        type="file"
        onChange={handleChange}
        style={{margin: '10px 0px'}}
      />
      <button
        style={styles.button}
        onClick={createUser}>Upload Video</button>
      {
        state.users.map((u, i) => {
          return (
            <div
              key={i}
            >
              <p
                style={styles.username}
               onClick={() => fetchImage(u.avatar.key)}>{u.username}</p>
            </div>
          )
        })
      }
      <a id="download" href="" download>
        <button style={styles.button}>Download</button>
      </a> 

      <button style={styles.button} onClick={deleteVideo}>Delete</button>
    </div>
  )
}

const styles = {
  container: {
    width: 300,
    margin: '0 auto'
  },
  username: {
    cursor: 'pointer',
    border: '1px solid #ddd',
    padding: '5px 25px'
  },
  button: {
    width: 200,
    backgroundColor: '#ddd',
    cursor: 'pointer',
    height: 30,
    margin: '0px 0px 8px'
  }
}

export default withAuthenticator(App, { includeGreetings: true })
