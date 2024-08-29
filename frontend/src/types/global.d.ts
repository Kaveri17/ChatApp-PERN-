// a special file where types added here can be used globally anywhere in the project without importing them

type ConversationType = {
    id: string
    fullName: string
    profilePic: string
}

type MessageType ={
    id: string
    body : string
    senderId: string
    createdAt: string
    shouldShake?: boolean //optional field
}