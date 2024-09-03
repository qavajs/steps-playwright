import { $, $$, Component } from '../../po';
export default class App {
    SimpleTextElement = $('#textValue');
    SimpleTextListItems = $$('#textValueList li');
    SimpleTextInput = $('#textInput');
    FileInput = $('#fileInput');
    Action = $('#action');
    AlertButton = $('#confirm');
    PromptButton = $('#prompt');
    Body = $('body');
    Button = $('#button');
    ButtonTap = $('#buttonTap');
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
    InfiniteScroll = $('#infiniteScroll');
    InfiniteScrollItems = $$('#infiniteScroll li');
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

    ScrollElement = $('#scrollElement');
    PseudoRandomText = $('#randomText');
    RandomlyDisabledButton = $('#isDisabledButton');
    FlipCoin = $('#flipCoin');
    Coin = $('#coin');
    DigitInput = $('#digitInput');
    PlusButton = $('#plusButton');
    FetchButton = $('#fetchButton');
    FetchResult = $('#fetchResult');

    // Electron
    OpenNewWindowElectronButton = $('#electronButton');
    CloseCurrentWindowElectronButton = $('#closeCurrentWindow');

    //JS Selector
    SimpleTextElementByJS = $('js=document.querySelectorAll("#textValue")');
    SimpleTextListItemsByJS = $$('js=document.querySelectorAll("#textValueList li")');
}

class IgnoreHierarchyComponent extends Component {
    Input = $('#input', { ignoreHierarchy: true });
}

class ComponentWithoutSelector {
    Input = $('#input');
}
