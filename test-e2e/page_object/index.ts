import { $, $$, Component } from '@qavajs/po-playwright';
export default class App {
    SimpleTextElement = $('#textValue');
    SimpleTextListItems = $$('#textValueList li');
    SimpleTextInput = $('#textInput');
    FileInput = $('#fileInput');
    Action = $('#action');
    AlertButton = $('#confirm');
    PromptButton = $('#prompt');
    Button = $('#button');
    ButtonHover = $('#buttonHover');
    Input = $('#input');
    Select = $('#select');
    Buttons = $$('.button');
    IFrame = $('iframe#firstIframe');
    InnerIFrame = $('iframe#innerIframe');
    FrameElement = $('#frameElement');
    InnerFrameElement = $('#innerFrameElement');
    NewTabLink = $('#newTabLink');
    EnabledButton = $('#enabledButton');
    DisabledButton = $('#disabledButton');
    PresentElement = $('#present');
    PresentCollection = $$('#present');
    DetachElement = $('#detach');
    VisibleElement = $('#visible');
    HiddenElement = $('#hidden');

    Loading = $('#loading');
    LoadingInput = $('#loadingInput');
    WaitCollection = $$('#waitCollection > div');
    PressCounter = $('#pressCounter');

    Users = $$('#users > li');
    OverflowContainer = $('#overflowContainer');

    IgnoreHierarchyComponent = $(new IgnoreHierarchyComponent('#ignoreHierarchyComponent'));
    ComponentWithoutSelector = $(new ComponentWithoutSelector());
    KeyDump = $('#keywordevent');

    Cookie = $('#cookie');
    LocalStorage = $('#localStorage');
    SessionStorage = $('#sessionStorage');

    DropZone = $('div#div1');
    DragElement = $('div#drag1');
    DragElementInDropZone = $('div#div1 div#drag1');

    EventHandler = $('#mouseEvent');
    KeyboardEventHandler = $('#keyboardEvent');

}

class IgnoreHierarchyComponent extends Component {
    Input = $('#input', { ignoreHierarchy: true });
}

class ComponentWithoutSelector {
    Input = $('#input');
}
