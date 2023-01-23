import { $, $$, Component } from '@qavajs/po-playwright';
export default class App {
    SimpleTextElement = $('#textValue');
    SimpleTextListItems = $$('#textValueList li');
    SimpleTextInput = $('#textInput');

    Action = $('#action');
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

    Users = $$('#users > li');
    OverflowContainer = $('#overflowContainer');

    IgnoreHierarchyComponent = $(new IgnoreHierarchyComponent('#ignoreHierarchyComponent'));

}

class IgnoreHierarchyComponent extends Component {
    Input = $('#input', { ignoreHierarchy: true });
}
