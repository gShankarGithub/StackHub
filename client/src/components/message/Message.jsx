import './message.css'
import moment from 'moment'


function Message({ message, own }) {
    return (
        
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                {/* <img className='messageImg' src='https://qph.cf2.quoracdn.net/main-qimg-cf89e8e6daa9dabc8174c303e4d53d3a'></img> */}
                <p className='messageText'>{message?.text}</p>
            </div>
            <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>

        </div>
    )
}

export default Message