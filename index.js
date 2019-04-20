import { createStore, applyMiddleware, thunkMiddleware, delayMiddleware, loggingMiddleware } from './mini-redux';
import { connect, Provider } from './mini-react-redux';
import { api } from './fakeapi';

//////////////////////
// action types //
//////////////////////

// using constants, then typos will go through as undefined, which will throw an error. So will know right away and fix it.
const CREATE_NOTE = 'CREATE_NOTE';
const UPDATE_NOTE = 'UPDATE_NOTE';
const OPEN_NOTE = 'OPEN_NOTE';
const CLOSE_NOTE = 'CLOSE_NOTE';

/////////////////
// reducer //
/////////////////

const initialState = {
    notes: {},
    openNoteId: null,
    isLoading: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case CREATE_NOTE: {
            if (!action.id) {
                return {
                    ...state,
                    isLoading: true
                };
            }
            const newNote = {
                id: action.id,
                content: ''
            };
            return {
                ...state,
                isLoading: false,
                openNoteId: action.id,
                notes: {
                    ...state.notes,
                    [action.id]: newNote
                }
            };
        }
        case UPDATE_NOTE: {
            const {id, content} = action;
            const editedNote = {
                ...state.notes[id],
                content
            };
            return {
                ...state,
                notes: {
                    ...state.notes,
                    [id]: editedNote
                }
            };
        }
        case OPEN_NOTE: {
            return {
                ...state,
                openNoteId: action.id
            };
        }
        case CLOSE_NOTE: {
            return {
                ...state,
                openNoteId: null
            };
        }
        default:
            return state;
    }
};

///////////////
// store //
///////////////

const store = createStore(reducer, applyMiddleware(
    thunkMiddleware,
    loggingMiddleware
));

////////////////////
// components //
////////////////////

const NoteEditor = ({note, onChangeNote, onCloseNote}) => {
    <div>
        <div>
            <textarea
                className="editor-content"
                autoFocus
                value={note.content}
                onChange={event => onChangeNote(note.id, event.target.value)}
                rows={10} cols={80}
            />
        </div>
        <button className="editor-button" onClick={onCloseNote}>Close</button>
    </div>
}

const NoteTitle = ({note}) => {
    const title = note.content.split('\n')[0].replace(/^\s+|\s+$/g, '');
    if (title === '') {
        return <i>Untitled</i>;
    }
    return <span>{title}</span>;
};

const NoteLink = ({note, onOpenNote}) => {
    <li className="note-list-item">
        <a href="#" onClick={() => onOpenNote(note.id)}>
            <NoteTitle note={note}/>
        </a>
    </li>
}

const NoteList = ({notes, onOpenNote}) => {
    <ul className="note-list">
        {
            Object.keys(notes).map(id =>
                <NoteLink
                    key={id}
                    note={notes[id]}
                    onOpenNote={onOpenNote}
                />
            )
        }
    </ul>
};

const NoteApp = ({notes, openNoteId, onAddNote, onChangeNote, onOpenNote, onCloseNote}) => {
    <div>
        {
            openNoteId ? 
            <NoteEditor
                note={notes[openNoteId]} onChangeNote={onChangeNote}
                onCloseNote={onCloseNote}
            /> :
            <div>
                <NoteList notes={notes} onOpenNote={onOpenNote}/>
                <button className="editor-button" onClick={onAddNote}>New Note</button>
            </div>
        }
    </div>
}

const mapStateToProps = state => ({
    notes: state.notes,
    openNoteId: state.openNoteId
});

const mapDispatchToProps = dispatch => ({
    onAddNote: () => dispatch(
        (dispatch) => {
            dispatch({
                type: CREATE_NOTE
            });
            api.createNote()
            .then(({id}) => {
                dispatch({
                    type: CREATE_NOTE,
                    id
                });
            });
        }
    ),
    onChangeNote: (id, content) => dispatch({
        type: UPDATE_NOTE,
        id,
        content
    }),
    onOpenNote: id => dispatch({
        type: OPEN_NOTE,
        id
    }),
    onCloseNote: () => dispatch({
        type: CLOSE_NOTE
    })
});

const NoteAppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(NoteApp);

////////////////////
// Render app //
////////////////////

ReactDOM.render(
    <Provider store={store}>
        <NoteAppContainer/>
    </Provider>,
    document.getElementById('root')
);