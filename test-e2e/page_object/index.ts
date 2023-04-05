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

    FrameElement = $('#frameElement');

    NewTabLink = $('#newTabLink');

    PresentElement = $('#present');
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

}

class IgnoreHierarchyComponent extends Component {
    Input = $('#input', { ignoreHierarchy: true });
}

class ComponentWithoutSelector {
    Input = $('#input');
}
