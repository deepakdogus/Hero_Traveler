package com.herotravelermobile.editor;

import android.support.annotation.NonNull;
import android.text.InputFilter;
import android.text.InputType;
import android.text.Spannable;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.LayoutShadowNode;
import com.facebook.react.uimanager.Spacing;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.UIManagerModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.views.scroll.ScrollEventType;
import com.facebook.react.views.text.ReactTextUpdate;
import com.facebook.react.views.text.TextInlineImageSpan;
import com.facebook.react.views.textinput.ReactTextInputShadowNode;
import com.herotravelermobile.editor.event.OnInsertTextRequest;
import com.herotravelermobile.editor.event.OnSelectionChangeRequest;
import com.herotravelermobile.editor.model.DraftJsContent;
import com.herotravelermobile.editor.model.DraftJsSelection;

import java.util.Map;

import javax.annotation.Nullable;

import kotlin.Unit;
import kotlin.jvm.functions.Function1;

/**
 * Manages instances of TextInput.
 */
@ReactModule(name = RNDJDraftJSEditorManager.REACT_CLASS)
public class RNDJDraftJSEditorManager extends BaseViewManager<RNDJDraftJSEditor, LayoutShadowNode> {
    protected static final String REACT_CLASS = "RNDJDraftJSEditor";

    private static final int[] SPACING_TYPES = {
            Spacing.ALL, Spacing.LEFT, Spacing.RIGHT, Spacing.TOP, Spacing.BOTTOM,
    };

    private static final int FOCUS_TEXT_INPUT = 1;
    private static final int BLUR_TEXT_INPUT = 2;

    private static final int INPUT_TYPE_KEYBOARD_NUMBERED =
            InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL |
                    InputType.TYPE_NUMBER_FLAG_SIGNED;

    private static final String KEYBOARD_TYPE_EMAIL_ADDRESS = "email-address";
    private static final String KEYBOARD_TYPE_NUMERIC = "numeric";
    private static final String KEYBOARD_TYPE_PHONE_PAD = "phone-pad";
    private static final String KEYBOARD_TYPE_VISIBLE_PASSWORD = "visible-password";
    private static final InputFilter[] EMPTY_FILTERS = new InputFilter[0];
    private static final int UNSET = -1;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    public RNDJDraftJSEditor createViewInstance(ThemedReactContext context) {
        RNDJDraftJSEditor editText = new RNDJDraftJSEditor(context);
        /*int inputType = editText.getInputType();
        editText.setInputType(inputType & (~InputType.TYPE_TEXT_FLAG_MULTI_LINE));
        editText.setReturnKeyType("done");
        editText.setTextSize(
                TypedValue.COMPLEX_UNIT_PX,
                (int) Math.ceil(PixelUtil.toPixelFromSP(ViewDefaults.FONT_SIZE_SP))
        );*/
        editText.setEventSender(createEventSender(editText));
        return editText;
    }

    @Override
    public LayoutShadowNode createShadowNodeInstance() {
        return new ReactTextInputShadowNode();
    }

    @Override
    public Class<? extends LayoutShadowNode> getShadowNodeClass() {
        return ReactTextInputShadowNode.class;
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        "topSubmitEditing",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onSubmitEditing",
                                        "captured",
                                        "onSubmitEditingCapture"
                                )
                        )
                )
                .put(
                        "topEndEditing",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onEndEditing",
                                        "captured",
                                        "onEndEditingCapture"
                                )
                        )
                )
                .put(
                        "topTextInput",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onTextInput",
                                        "captured",
                                        "onTextInputCapture"
                                )
                        )
                )
                .put(
                        "topFocus",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onFocus", "captured", "onFocusCapture")
                        )
                )
                .put(
                        "topBlur",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of("bubbled", "onBlur", "captured", "onBlurCapture")
                        )
                )
                .put(
                        "topKeyPress",
                        MapBuilder.of(
                                "phasedRegistrationNames",
                                MapBuilder.of(
                                        "bubbled",
                                        "onKeyPress",
                                        "captured",
                                        "onKeyPressCapture"
                                )
                        )
                )
                .build();
    }

    @Nullable
    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.<String, Object>builder()
                .put(
                        ScrollEventType.SCROLL.getJSEventName(),
                        MapBuilder.of("registrationName", "onScroll")
                )
                .put(
                        OnSelectionChangeRequest.EVENT_NAME,
                        MapBuilder.of("registrationName", OnSelectionChangeRequest.EVENT_NAME)
                )
                .put(
                        OnInsertTextRequest.EVENT_NAME,
                        MapBuilder.of("registrationName", OnInsertTextRequest.EVENT_NAME)
                )
                .build();
    }

    @Override
    public @Nullable
    Map<String, Integer> getCommandsMap() {
        return MapBuilder.of("focusTextInput", FOCUS_TEXT_INPUT, "blurTextInput", BLUR_TEXT_INPUT);
    }

    @Override
    public void receiveCommand(
            RNDJDraftJSEditor RNDJDraftJSEditor,
            int commandId,
            @Nullable ReadableArray args
    ) {
        switch (commandId) {
            case FOCUS_TEXT_INPUT:
                Log.d("DraftJS", "focusTextInput() received");
                //RNDJDraftJSEditor.requestFocusFromJS();
                break;
            case BLUR_TEXT_INPUT:
                //RNDJDraftJSEditor.clearFocusFromJS();
                break;
        }
    }

    @Override
    public void updateExtraData(RNDJDraftJSEditor view, Object extraData) {
        if (extraData instanceof ReactTextUpdate) {
            ReactTextUpdate update = (ReactTextUpdate) extraData;

            view.setPadding(
                    (int) update.getPaddingLeft(),
                    (int) update.getPaddingTop(),
                    (int) update.getPaddingRight(),
                    (int) update.getPaddingBottom()
            );

            if (update.containsImages()) {
                Spannable spannable = update.getText();
                TextInlineImageSpan.possiblyUpdateInlineImageSpans(spannable, view);
            }
            //view.maybeSetText(update);
        }
    }

    @ReactProp(name = "content")
    public void setContent(RNDJDraftJSEditor view, ReadableMap content) {
        view.setContent(new DraftJsContent(content));
    }

    @ReactProp(name = "selection")
    public void setSelection(RNDJDraftJSEditor view, ReadableMap selection) {
        view.setSelection(new DraftJsSelection(selection));
    }

    @ReactProp(name = "onSelectionChangeRequest")
    public void setOnSelectionChangeRequest(RNDJDraftJSEditor view, boolean enabled) {
        view.setOnSelectionChangedEnabled(enabled);
    }

    @ReactProp(name = "onInsertTextRequest")
    public void setOnInsertTextRequest(RNDJDraftJSEditor view, boolean enabled) {
        view.setOnInsertTextEnabled(enabled);
    }

    @NonNull
    private Function1<Event<?>, Unit> createEventSender(RNDJDraftJSEditor view) {
        return event -> {
            final ReactContext reactContext = (ReactContext) view.getContext();
            reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher()
                    .dispatchEvent(event);
            return null;
        };
    }

    /*
    @ReactProp(name = ViewProps.FONT_SIZE, defaultFloat = ViewDefaults.FONT_SIZE_SP)
    public void setFontSize(RNDJDraftJSEditor view, float fontSize) {
        view.setTextSize(
                TypedValue.COMPLEX_UNIT_PX,
                (int) Math.ceil(PixelUtil.toPixelFromSP(fontSize))
        );
    }

    @ReactProp(name = ViewProps.FONT_FAMILY)
    public void setFontFamily(RNDJDraftJSEditor view, String fontFamily) {
        int style = Typeface.NORMAL;
        if (view.getTypeface() != null) {
            style = view.getTypeface().getStyle();
        }
        Typeface newTypeface = ReactFontManager.getInstance().getTypeface(
                fontFamily,
                style,
                view.getContext().getAssets()
        );
        view.setTypeface(newTypeface);
    }

    *//**
     /* This code was taken from the method setFontWeight of the class ReactTextShadowNode
     /* TODO: Factor into a common place they can both use
     *//*
    @ReactProp(name = ViewProps.FONT_WEIGHT)
    public void setFontWeight(RNDJDraftJSEditor view, @Nullable String fontWeightString) {
        int fontWeightNumeric = fontWeightString != null ?
                parseNumericFontWeight(fontWeightString) : -1;
        int fontWeight = UNSET;
        if (fontWeightNumeric >= 500 || "bold".equals(fontWeightString)) {
            fontWeight = Typeface.BOLD;
        } else if ("normal".equals(fontWeightString) ||
                (fontWeightNumeric != -1 && fontWeightNumeric < 500)) {
            fontWeight = Typeface.NORMAL;
        }
        Typeface currentTypeface = view.getTypeface();
        if (currentTypeface == null) {
            currentTypeface = Typeface.DEFAULT;
        }
        if (fontWeight != currentTypeface.getStyle()) {
            view.setTypeface(currentTypeface, fontWeight);
        }
    }

    *//**
     /* This code was taken from the method setFontStyle of the class ReactTextShadowNode
     /* TODO: Factor into a common place they can both use
     *//*
    @ReactProp(name = ViewProps.FONT_STYLE)
    public void setFontStyle(RNDJDraftJSEditor view, @Nullable String fontStyleString) {
        int fontStyle = UNSET;
        if ("italic".equals(fontStyleString)) {
            fontStyle = Typeface.ITALIC;
        } else if ("normal".equals(fontStyleString)) {
            fontStyle = Typeface.NORMAL;
        }

        Typeface currentTypeface = view.getTypeface();
        if (currentTypeface == null) {
            currentTypeface = Typeface.DEFAULT;
        }
        if (fontStyle != currentTypeface.getStyle()) {
            view.setTypeface(currentTypeface, fontStyle);
        }
    }

    @ReactProp(name = "selection")
    public void setSelection(RNDJDraftJSEditor view, @Nullable ReadableMap selection) {
        if (selection == null) {
            return;
        }

        if (selection.hasKey("start") && selection.hasKey("end")) {
            view.setSelection(selection.getInt("start"), selection.getInt("end"));
        }
    }

    @ReactProp(name = "onSelectionChange", defaultBoolean = false)
    public void setOnSelectionChange(final RNDJDraftJSEditor view, boolean onSelectionChange) {
        Log.d("DraftJS", "onSelectionChange()");
        if (onSelectionChange) {
            view.setSelectionWatcher(new ReactSelectionWatcher(view));
        } else {
            view.setSelectionWatcher(null);
        }
    }

    @ReactProp(name = "blurOnSubmit")
    public void setBlurOnSubmit(RNDJDraftJSEditor view, @Nullable Boolean blurOnSubmit) {
        view.setBlurOnSubmit(blurOnSubmit);
    }

    @ReactProp(name = "onContentSizeChange", defaultBoolean = false)
    public void setOnContentSizeChange(final RNDJDraftJSEditor view, boolean onContentSizeChange) {
        if (onContentSizeChange) {
            view.setContentSizeWatcher(new ReactContentSizeWatcher(view));
        } else {
            view.setContentSizeWatcher(null);
        }
    }

    @ReactProp(name = "onScroll", defaultBoolean = false)
    public void setOnScroll(final RNDJDraftJSEditor view, boolean onScroll) {
        if (onScroll) {
            view.setScrollWatcher(new ReactScrollWatcher(view));
        } else {
            view.setScrollWatcher(null);
        }
    }

    @ReactProp(name = "placeholder")
    public void setPlaceholder(RNDJDraftJSEditor view, @Nullable String placeholder) {
        view.setHint(placeholder);
    }

    @ReactProp(name = "placeholderTextColor", customType = "Color")
    public void setPlaceholderTextColor(RNDJDraftJSEditor view, @Nullable Integer color) {
        if (color == null) {
            view.setHintTextColor(DefaultStyleValuesUtil.getDefaultTextColorHint(view.getContext()));
        } else {
            view.setHintTextColor(color);
        }
    }

    @ReactProp(name = "selectionColor", customType = "Color")
    public void setSelectionColor(RNDJDraftJSEditor view, @Nullable Integer color) {
        if (color == null) {
            view.setHighlightColor(DefaultStyleValuesUtil.getDefaultTextColorHighlight(view.getContext()));
        } else {
            view.setHighlightColor(color);
        }

        setCursorColor(view, color);
    }

    private void setCursorColor(RNDJDraftJSEditor view, @Nullable Integer color) {
        // Evil method that uses reflection because there is no public API to changes
        // the cursor color programmatically.
        // Based on http://stackoverflow.com/questions/25996032/how-to-change-programatically-edittext-cursor-color-in-android.
        try {
            // Get the original cursor drawable resource.
            Field cursorDrawableResField = TextView.class.getDeclaredField("mCursorDrawableRes");
            cursorDrawableResField.setAccessible(true);
            int drawableResId = cursorDrawableResField.getInt(view);

            // The view has no cursor drawable.
            if (drawableResId == 0) {
                return;
            }

            Drawable drawable = ContextCompat.getDrawable(view.getContext(), drawableResId);
            if (color != null) {
                drawable.setColorFilter(color, PorterDuff.Mode.SRC_IN);
            }
            Drawable[] drawables = {drawable, drawable};

            // Update the current cursor drawable with the new one.
            Field editorField = TextView.class.getDeclaredField("mEditor");
            editorField.setAccessible(true);
            Object editor = editorField.get(view);
            Field cursorDrawableField = editor.getClass().getDeclaredField("mCursorDrawable");
            cursorDrawableField.setAccessible(true);
            cursorDrawableField.set(editor, drawables);
        } catch (NoSuchFieldException ex) {
            // Ignore errors to avoid crashing if these private fields don't exist on modified
            // or future android versions.
        } catch (IllegalAccessException ex) {
        }
    }

    @ReactProp(name = "caretHidden", defaultBoolean = false)
    public void setCaretHidden(RNDJDraftJSEditor view, boolean caretHidden) {
        view.setCursorVisible(!caretHidden);
    }

    @ReactProp(name = "selectTextOnFocus", defaultBoolean = false)
    public void setSelectTextOnFocus(RNDJDraftJSEditor view, boolean selectTextOnFocus) {
        view.setSelectAllOnFocus(selectTextOnFocus);
    }

    @ReactProp(name = ViewProps.COLOR, customType = "Color")
    public void setColor(RNDJDraftJSEditor view, @Nullable Integer color) {
        if (color == null) {
            view.setTextColor(DefaultStyleValuesUtil.getDefaultTextColor(view.getContext()));
        } else {
            view.setTextColor(color);
        }
    }

    @ReactProp(name = "underlineColorAndroid", customType = "Color")
    public void setUnderlineColor(RNDJDraftJSEditor view, @Nullable Integer underlineColor) {
        // Drawable.mutate() can sometimes crash due to an AOSP bug:
        // See https://code.google.com/p/android/issues/detail?id=191754 for more info
        Drawable background = view.getBackground();
        Drawable drawableToMutate = background.getConstantState() != null ?
                background.mutate() :
                background;

        if (underlineColor == null) {
            drawableToMutate.clearColorFilter();
        } else {
            drawableToMutate.setColorFilter(underlineColor, PorterDuff.Mode.SRC_IN);
        }
    }

    @ReactProp(name = ViewProps.TEXT_ALIGN)
    public void setTextAlign(RNDJDraftJSEditor view, @Nullable String textAlign) {
        if (textAlign == null || "auto".equals(textAlign)) {
            view.setGravityHorizontal(Gravity.NO_GRAVITY);
        } else if ("left".equals(textAlign)) {
            view.setGravityHorizontal(Gravity.LEFT);
        } else if ("right".equals(textAlign)) {
            view.setGravityHorizontal(Gravity.RIGHT);
        } else if ("center".equals(textAlign)) {
            view.setGravityHorizontal(Gravity.CENTER_HORIZONTAL);
        } else if ("justify".equals(textAlign)) {
            // Fallback gracefully for cross-platform compat instead of error
            view.setGravityHorizontal(Gravity.LEFT);
        } else {
            throw new JSApplicationIllegalArgumentException("Invalid textAlign: " + textAlign);
        }
    }

    @ReactProp(name = ViewProps.TEXT_ALIGN_VERTICAL)
    public void setTextAlignVertical(RNDJDraftJSEditor view, @Nullable String textAlignVertical) {
        if (textAlignVertical == null || "auto".equals(textAlignVertical)) {
            view.setGravityVertical(Gravity.NO_GRAVITY);
        } else if ("top".equals(textAlignVertical)) {
            view.setGravityVertical(Gravity.TOP);
        } else if ("bottom".equals(textAlignVertical)) {
            view.setGravityVertical(Gravity.BOTTOM);
        } else if ("center".equals(textAlignVertical)) {
            view.setGravityVertical(Gravity.CENTER_VERTICAL);
        } else {
            throw new JSApplicationIllegalArgumentException("Invalid textAlignVertical: " + textAlignVertical);
        }
    }

    @ReactProp(name = "inlineImageLeft")
    public void setInlineImageLeft(RNDJDraftJSEditor view, @Nullable String resource) {
        int id = ResourceDrawableIdHelper.getInstance().getResourceDrawableId(
                view.getContext(),
                resource
        );
        view.setCompoundDrawablesWithIntrinsicBounds(id, 0, 0, 0);
    }

    @ReactProp(name = "inlineImagePadding")
    public void setInlineImagePadding(RNDJDraftJSEditor view, int padding) {
        view.setCompoundDrawablePadding(padding);
    }

    @ReactProp(name = "editable", defaultBoolean = true)
    public void setEditable(RNDJDraftJSEditor view, boolean editable) {
        view.setEnabled(editable);
    }

    @ReactProp(name = ViewProps.NUMBER_OF_LINES, defaultInt = 1)
    public void setNumLines(RNDJDraftJSEditor view, int numLines) {
        view.setLines(numLines);
    }

    @ReactProp(name = "maxLength")
    public void setMaxLength(RNDJDraftJSEditor view, @Nullable Integer maxLength) {
        InputFilter[] currentFilters = view.getFilters();
        InputFilter[] newFilters = EMPTY_FILTERS;

        if (maxLength == null) {
            if (currentFilters.length > 0) {
                LinkedList<InputFilter> list = new LinkedList<>();
                for (int i = 0; i < currentFilters.length; i++) {
                    if (!(currentFilters[i] instanceof InputFilter.LengthFilter)) {
                        list.add(currentFilters[i]);
                    }
                }
                if (!list.isEmpty()) {
                    newFilters = (InputFilter[]) list.toArray(new InputFilter[list.size()]);
                }
            }
        } else {
            if (currentFilters.length > 0) {
                newFilters = currentFilters;
                boolean replaced = false;
                for (int i = 0; i < currentFilters.length; i++) {
                    if (currentFilters[i] instanceof InputFilter.LengthFilter) {
                        currentFilters[i] = new InputFilter.LengthFilter(maxLength);
                        replaced = true;
                    }
                }
                if (!replaced) {
                    newFilters = new InputFilter[currentFilters.length + 1];
                    System.arraycopy(currentFilters, 0, newFilters, 0, currentFilters.length);
                    currentFilters[currentFilters.length] = new InputFilter.LengthFilter(maxLength);
                }
            } else {
                newFilters = new InputFilter[1];
                newFilters[0] = new InputFilter.LengthFilter(maxLength);
            }
        }

        view.setFilters(newFilters);
    }

    @ReactProp(name = "autoCorrect")
    public void setAutoCorrect(RNDJDraftJSEditor view, @Nullable Boolean autoCorrect) {
        // clear auto correct flags, set SUGGESTIONS or NO_SUGGESTIONS depending on value
        updateStagedInputTypeFlag(
                view,
                InputType.TYPE_TEXT_FLAG_AUTO_CORRECT | InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS,
                autoCorrect != null ?
                        (autoCorrect.booleanValue() ?
                                InputType.TYPE_TEXT_FLAG_AUTO_CORRECT : InputType.TYPE_TEXT_FLAG_NO_SUGGESTIONS)
                        : 0
        );
    }

    @ReactProp(name = "multiline", defaultBoolean = false)
    public void setMultiline(RNDJDraftJSEditor view, boolean multiline) {
        updateStagedInputTypeFlag(
                view,
                multiline ? 0 : InputType.TYPE_TEXT_FLAG_MULTI_LINE,
                multiline ? InputType.TYPE_TEXT_FLAG_MULTI_LINE : 0
        );
    }

    @ReactProp(name = "secureTextEntry", defaultBoolean = false)
    public void setSecureTextEntry(RNDJDraftJSEditor view, boolean password) {
        updateStagedInputTypeFlag(
                view,
                password ? 0 :
                        InputType.TYPE_NUMBER_VARIATION_PASSWORD | InputType.TYPE_TEXT_VARIATION_PASSWORD,
                password ? InputType.TYPE_TEXT_VARIATION_PASSWORD : 0
        );
        checkPasswordType(view);
    }

    @ReactProp(name = "autoCapitalize")
    public void setAutoCapitalize(RNDJDraftJSEditor view, int autoCapitalize) {
        updateStagedInputTypeFlag(
                view,
                InputType.TYPE_TEXT_FLAG_CAP_SENTENCES | InputType.TYPE_TEXT_FLAG_CAP_WORDS |
                        InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS,
                autoCapitalize
        );
    }

    @ReactProp(name = "keyboardType")
    public void setKeyboardType(RNDJDraftJSEditor view, @Nullable String keyboardType) {
        int flagsToSet = InputType.TYPE_CLASS_TEXT;
        if (KEYBOARD_TYPE_NUMERIC.equalsIgnoreCase(keyboardType)) {
            flagsToSet = INPUT_TYPE_KEYBOARD_NUMBERED;
        } else if (KEYBOARD_TYPE_EMAIL_ADDRESS.equalsIgnoreCase(keyboardType)) {
            flagsToSet = InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS | InputType.TYPE_CLASS_TEXT;
        } else if (KEYBOARD_TYPE_PHONE_PAD.equalsIgnoreCase(keyboardType)) {
            flagsToSet = InputType.TYPE_CLASS_PHONE;
        } else if (KEYBOARD_TYPE_VISIBLE_PASSWORD.equalsIgnoreCase(keyboardType)) {
            flagsToSet = InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD;
        }
        updateStagedInputTypeFlag(
                view,
                INPUT_TYPE_KEYBOARD_NUMBERED | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS |
                        InputType.TYPE_CLASS_TEXT,
                flagsToSet
        );
        checkPasswordType(view);
    }

    @ReactProp(name = "returnKeyType")
    public void setReturnKeyType(RNDJDraftJSEditor view, String returnKeyType) {
        view.setReturnKeyType(returnKeyType);
    }

    @ReactProp(name = "disableFullscreenUI", defaultBoolean = false)
    public void setDisableFullscreenUI(RNDJDraftJSEditor view, boolean disableFullscreenUI) {
        view.setDisableFullscreenUI(disableFullscreenUI);
    }

    private static final int IME_ACTION_ID = 0x670;

    @ReactProp(name = "returnKeyLabel")
    public void setReturnKeyLabel(RNDJDraftJSEditor view, String returnKeyLabel) {
        view.setImeActionLabel(returnKeyLabel, IME_ACTION_ID);
    }

    @ReactPropGroup(names = {
            ViewProps.BORDER_RADIUS,
            ViewProps.BORDER_TOP_LEFT_RADIUS,
            ViewProps.BORDER_TOP_RIGHT_RADIUS,
            ViewProps.BORDER_BOTTOM_RIGHT_RADIUS,
            ViewProps.BORDER_BOTTOM_LEFT_RADIUS
    }, defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderRadius(RNDJDraftJSEditor view, int index, float borderRadius) {
        if (!YogaConstants.isUndefined(borderRadius)) {
            borderRadius = PixelUtil.toPixelFromDIP(borderRadius);
        }

        if (index == 0) {
            view.setBorderRadius(borderRadius);
        } else {
            view.setBorderRadius(borderRadius, index - 1);
        }
    }

    @ReactProp(name = "borderStyle")
    public void setBorderStyle(RNDJDraftJSEditor view, @Nullable String borderStyle) {
        view.setBorderStyle(borderStyle);
    }

    @ReactPropGroup(names = {
            ViewProps.BORDER_WIDTH,
            ViewProps.BORDER_LEFT_WIDTH,
            ViewProps.BORDER_RIGHT_WIDTH,
            ViewProps.BORDER_TOP_WIDTH,
            ViewProps.BORDER_BOTTOM_WIDTH,
    }, defaultFloat = YogaConstants.UNDEFINED)
    public void setBorderWidth(RNDJDraftJSEditor view, int index, float width) {
        if (!YogaConstants.isUndefined(width)) {
            width = PixelUtil.toPixelFromDIP(width);
        }
        view.setBorderWidth(SPACING_TYPES[index], width);
    }

    @ReactPropGroup(names = {
            "borderColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderBottomColor"
    }, customType = "Color")
    public void setBorderColor(RNDJDraftJSEditor view, int index, Integer color) {
        float rgbComponent = color == null ? YogaConstants.UNDEFINED : (float) ((int) color & 0x00FFFFFF);
        float alphaComponent = color == null ? YogaConstants.UNDEFINED : (float) ((int) color >>> 24);
        view.setBorderColor(SPACING_TYPES[index], rgbComponent, alphaComponent);
    }

    @Override
    protected void onAfterUpdateTransaction(RNDJDraftJSEditor view) {
        super.onAfterUpdateTransaction(view);
        view.commitStagedInputType();
    }

    // Sets the correct password type, since numeric and text passwords have different types
    private static void checkPasswordType(RNDJDraftJSEditor view) {
        if ((view.getStagedInputType() & INPUT_TYPE_KEYBOARD_NUMBERED) != 0 &&
                (view.getStagedInputType() & InputType.TYPE_TEXT_VARIATION_PASSWORD) != 0) {
            // Text input type is numbered password, remove text password variation, add numeric one
            updateStagedInputTypeFlag(
                    view,
                    InputType.TYPE_TEXT_VARIATION_PASSWORD,
                    InputType.TYPE_NUMBER_VARIATION_PASSWORD
            );
        }
    }

    *//**
     * This code was taken from the method parseNumericFontWeight of the class ReactTextShadowNode
     * TODO: Factor into a common place they can both use
     *
     * Return -1 if the input string is not a valid numeric fontWeight (100, 200, ..., 900), otherwise
     * return the weight.
     *//*
    private static int parseNumericFontWeight(String fontWeightString) {
        // This should be much faster than using regex to verify input and Integer.parseInt
        return fontWeightString.length() == 3 && fontWeightString.endsWith("00")
                && fontWeightString.charAt(0) <= '9' && fontWeightString.charAt(0) >= '1' ?
                100 * (fontWeightString.charAt(0) - '0') : -1;
    }

    private static void updateStagedInputTypeFlag(
            RNDJDraftJSEditor view,
            int flagsToUnset,
            int flagsToSet
    ) {
        view.setStagedInputType((view.getStagedInputType() & ~flagsToUnset) | flagsToSet);
    }

    private class ReactTextInputTextWatcher implements TextWatcher {

        private EventDispatcher mEventDispatcher;
        private RNDJDraftJSEditor mEditText;
        private String mPreviousText;

        public ReactTextInputTextWatcher(
                final ReactContext reactContext,
                final RNDJDraftJSEditor editText
        ) {
            mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
            mEditText = editText;
            mPreviousText = null;
        }

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            // Incoming charSequence gets mutated before onTextChanged() is invoked
            mPreviousText = s.toString();
        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            // Rearranging the text (i.e. changing between singleline and multiline attributes) can
            // also trigger onTextChanged, call the event in JS only when the text actually changed
            if (count == 0 && before == 0) {
                return;
            }

            Assertions.assertNotNull(mPreviousText);
            String newText = s.toString().substring(start, start + count);
            String oldText = mPreviousText.substring(start, start + before);
            // Don't send same text changes
            if (count == before && newText.equals(oldText)) {
                return;
            }

            // The event that contains the event counter and updates it must be sent first.
            // TODO: t7936714 merge these events
            mEventDispatcher.dispatchEvent(
                    new ReactTextChangedEvent(
                            mEditText.getId(),
                            s.toString(),
                            mEditText.incrementAndGetEventCounter()
                    ));

            mEventDispatcher.dispatchEvent(
                    new ReactTextInputEvent(
                            mEditText.getId(),
                            newText,
                            oldText,
                            start,
                            start + before
                    ));
        }

        @Override
        public void afterTextChanged(Editable s) {
        }
    }
*/
    /*@Override
    protected void addEventEmitters(
            final ThemedReactContext reactContext,
            final RNDJDraftJSEditor view
    ) {

    }*/
/*
    private class ReactContentSizeWatcher implements ContentSizeWatcher {
        private RNDJDraftJSEditor mEditText;
        private EventDispatcher mEventDispatcher;
        private int mPreviousContentWidth = 0;
        private int mPreviousContentHeight = 0;

        public ReactContentSizeWatcher(RNDJDraftJSEditor editText) {
            mEditText = editText;
            ReactContext reactContext = (ReactContext) editText.getContext();
            mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        }

        @Override
        public void onLayout() {
            int contentWidth = mEditText.getWidth();
            int contentHeight = mEditText.getHeight();

            // Use instead size of text content within EditText when available
            if (mEditText.getLayout() != null) {
                contentWidth = mEditText.getCompoundPaddingLeft() + mEditText.getLayout().getWidth() +
                        mEditText.getCompoundPaddingRight();
                contentHeight = mEditText.getCompoundPaddingTop() + mEditText.getLayout().getHeight() +
                        mEditText.getCompoundPaddingBottom();
            }

            if (contentWidth != mPreviousContentWidth || contentHeight != mPreviousContentHeight) {
                mPreviousContentHeight = contentHeight;
                mPreviousContentWidth = contentWidth;

                mEventDispatcher.dispatchEvent(
                        new ReactContentSizeChangedEvent(
                                mEditText.getId(),
                                PixelUtil.toDIPFromPixel(contentWidth),
                                PixelUtil.toDIPFromPixel(contentHeight)
                        ));
            }
        }
    }

    private class ReactSelectionWatcher implements SelectionWatcher {

        private RNDJDraftJSEditor mRNDJDraftJSEditor;
        private EventDispatcher mEventDispatcher;
        private int mPreviousSelectionStart;
        private int mPreviousSelectionEnd;

        public ReactSelectionWatcher(RNDJDraftJSEditor editText) {
            mRNDJDraftJSEditor = editText;
            ReactContext reactContext = (ReactContext) editText.getContext();
            mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        }

        @Override
        public void onSelectionChanged(int start, int end) {
            // Android will call us back for both the SELECTION_START span and SELECTION_END span in text
            // To prevent double calling back into js we cache the result of the previous call and only
            // forward it on if we have new values
            if (mPreviousSelectionStart != start || mPreviousSelectionEnd != end) {
                mEventDispatcher.dispatchEvent(
                        new ReactTextInputSelectionEvent(
                                mRNDJDraftJSEditor.getId(),
                                start,
                                end
                        ));

                mPreviousSelectionStart = start;
                mPreviousSelectionEnd = end;
            }
        }
    }

    private class ReactScrollWatcher implements ScrollWatcher {

        private RNDJDraftJSEditor mRNDJDraftJSEditor;
        private EventDispatcher mEventDispatcher;
        private int mPreviousHoriz;
        private int mPreviousVert;

        public ReactScrollWatcher(RNDJDraftJSEditor editText) {
            mRNDJDraftJSEditor = editText;
            ReactContext reactContext = (ReactContext) editText.getContext();
            mEventDispatcher = reactContext.getNativeModule(UIManagerModule.class).getEventDispatcher();
        }

        @Override
        public void onScrollChanged(int horiz, int vert, int oldHoriz, int oldVert) {
            if (mPreviousHoriz != horiz || mPreviousVert != vert) {
                ScrollEvent event = ScrollEvent.obtain(
                        mRNDJDraftJSEditor.getId(),
                        ScrollEventType.SCROLL,
                        horiz,
                        vert,
                        0f, // can't get x velocity
                        0f, // can't get y velocity
                        0, // can't get content width
                        0, // can't get content height
                        mRNDJDraftJSEditor.getWidth(),
                        mRNDJDraftJSEditor.getHeight()
                );

                mEventDispatcher.dispatchEvent(event);

                mPreviousHoriz = horiz;
                mPreviousVert = vert;
            }
        }
    }

    @Override
    public @Nullable
    Map getExportedViewConstants() {
        return MapBuilder.of(
                "AutoCapitalizationType",
                MapBuilder.of(
                        "none",
                        0,
                        "characters",
                        InputType.TYPE_TEXT_FLAG_CAP_CHARACTERS,
                        "words",
                        InputType.TYPE_TEXT_FLAG_CAP_WORDS,
                        "sentences",
                        InputType.TYPE_TEXT_FLAG_CAP_SENTENCES
                )
        );
    }*/
}
