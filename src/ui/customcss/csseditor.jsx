import {React, Settings, Events} from "modules";

import Editor from "./editor";
// import Checkbox from "./checkbox";
import Refresh from "../icons/reload";
import Save from "../icons/save";
import Edit from "../icons/edit";
import Cog from "../icons/cog";
import Detach from "../icons/detach";

export default class CssEditor extends React.Component {

    constructor(props) {
        super(props);

        this.toggleLiveUpdate = this.toggleLiveUpdate.bind(this);
        this.updateCss = this.updateCss.bind(this);
        this.saveCss = this.saveCss.bind(this);
        this.openDetached = this.props.openDetached ? this.openDetached.bind(this) : null;
        this.openNative = this.openNative.bind(this);
        this.updateEditor = this.updateEditor.bind(this);

        this.controls = [
            {label: React.createElement(Refresh, {size: "18px"}), tooltip: "Update", onClick: this.updateCss},
            {label: React.createElement(Save, {size: "18px"}), tooltip: "Save", onClick: this.saveCss},
            {label: React.createElement(Edit, {size: "18px"}), tooltip: "Open in System Editor", onClick: this.openNative},
            {label: React.createElement(Cog, {size: "18px"}), tooltip: "Editor Settings", onClick: "showSettings"},
            {label: "Live Update", type:"checkbox", onChange: this.toggleLiveUpdate, checked: Settings.get("settings", "customcss", "liveUpdate"), side: "right"}
        ];
        if (this.openDetached) this.controls.push({label: React.createElement(Detach, {size: "18px"}), tooltip: "Detach Editor", onClick: this.openDetached, side: "right"});
    }

    componentDidMount() {
        Events.on("customcss-updated", this.updateEditor);
    }

    componentWillUnmount() {
        Events.off("customcss-updated", this.updateEditor);
    }

    updateEditor(newCSS) {
        if (!this.editor) return;
        this.editor.value = newCSS;
    }

    setEditorRef(editor) {
        this.editor = editor;
        if (this.props.editorRef && typeof(this.props.editorRef.current) !== "undefined") this.props.editorRef.current = editor;
        else if (this.props.editorRef) this.props.editorRef = editor;
    }

    render() {
        return <Editor ref={this.setEditorRef.bind(this)} readOnly={this.props.readOnly} id={this.props.id || "bd-customcss-editor"} onChange={this.props.onChange} controls={this.controls} value={this.props.css} />;
    }

    toggleLiveUpdate(checked) {
        Settings.set("settings", "customcss", "liveUpdate", checked);
    }

    updateCss(event, newCss) {
        if (this.props.update) this.props.update(newCss);
    }

    saveCss(event, newCss) {
        if (this.props.save) this.props.save(newCss);
    }

    openDetached(event, currentCSS) {
        if (!this.props.openDetached) return;
        this.props.openDetached(currentCSS);
    }

    openNative() {
        if (this.props.openNative) this.props.openNative();
    }
}