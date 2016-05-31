var XFormR = (function(){
    
    var renderers = {};
    
    return {
        
        registerRenderer: function(name, callback){
            if(!renderers[name])
                renderers[name] = [];
            renderers[name].push(callback);
        },
        
        Factory: function(options){
            
            var self = this,
                _$def,
                _data = {},
                _afterRenderCallbacks = [],
                _renderers = $.extend({}, renderers),
                DEFAULT_APPLICABLE_HTML_ATTRIBUTES = [
                    'style', 'class'
                ];
                
            this.options = options;
                
            this.registerRenderer = function(name, callback){
                if(!renderers[name])
                    renderers[name] = [];
                _renderers[name].push(callback);
            };
            
            this.setDefinition = function(xml){
                _$def = $(xml).children().first();
            };
            
            this.setData = function(data){
                _data = data;
            }
            
            this.render = function(){
                var $output = this.renderDefinition(_$def);
                this.invokeAfterRenderCallbacks($output);
                return $output;
            };
            
            this.afterRender = function(callback){
                _afterRenderCallbacks.push(callback);
            };
            
            this.invokeAfterRenderCallbacks = function($output) {
                $.each(_afterRenderCallbacks, function(idx, callback){
                    callback.call(self, $output);
                });
                _afterRenderCallbacks = [];
            };
            
            this.renderType = function(name, $def){
                if(name.indexOf('xf:') === 0){
                    var $ele;
                    if(renderers[name]){
                        $.each(renderers[name], function(idx, renderer){
                            $ele = renderer.call(self, $def, $ele);
                        });
                    }else{
                        console.warn('No renderer: '+name);
                    }
                    if($def.attr('when')){
                        var contextType = $def.attr('when-context-type');
                        if(!contextType)
                            contextType = 'closest';
                        switch(contextType){
                            case 'closest':
                                var $conditionalContainerDef = $def.parent().closest($def.attr('when-context-control').replace(':', '\\:').replace('"', '\\"')),
                                    $conditionalTriggerDef = $conditionalContainerDef.find('[name="'+$def.attr('when').replace('"', '\\"')+'"]'),
                                    triggerValue = $def.attr('when-value'),
                                    $eleChildren = $ele.children();
                                this.afterRender(function($output){
                                    $output.find('[name="'+self.getFieldName($conditionalTriggerDef).replace('"', '\\"')+'"]').change(function(){
                                        var triggered = ($(this).val() == triggerValue);
                                        if(!triggered){
                                            switch(triggerValue.toLowerCase()){
                                                case 'true': if($(this).val() == '{{TYPE_TRUE}}') triggered = true; break;
                                                case 'false': if($(this).val() == '{{TYPE_FALSE}}') triggered = true; break;
                                                case 'null': if($(this).val() == '{{TYPE_NULL}}') triggered = true; break;
                                            }
                                        }
                                        if(!triggered){
                                            $ele.hide();
                                            $eleChildren.detach();
                                        }else{
                                            $eleChildren.appendTo($ele);
                                            $ele.show();
                                        }
                                    }).change();
                                });
                                break;
                        }
                    }
                    return $ele;
                }else{
                    var $ele = $(document.createElement($def.prop('tagName')));
                    this.applyHtmlAttributesFromDef($ele, $def, false);
                    if($def.children().length > 0){
                        $ele.append(this.renderDefinition($def.children()))
                    }else{
                        $ele.html($def.html());
                    }
                    return $ele;
                }
            };
            
            this.applyHtmlAttributesFromDef = function($ele, def, applicableAttributes){
                if(applicableAttributes === undefined)
                    applicableAttributes = DEFAULT_APPLICABLE_HTML_ATTRIBUTES;
                if(def instanceof $)
                    def = def.get()[0];
                if(!($ele instanceof $))
                    $ele = $($ele);
                for(var i in def.attributes){
                    var attrName = def.attributes[i].name,
                        attrValue = def.getAttribute(attrName);
                    if(attrValue)
                        if(applicableAttributes === false || $.inArray(attrName, applicableAttributes) >= 0)
                            $ele.attr(attrName, attrValue);
                }
            };
            
            this.renderDefinition = function($def){
                if($def.length == 1){
                    return self.renderType($def.first().prop('tagName'), $def.first());
                }else if($def.length > 1){
                    return $def.map(function(){
                        return self.renderDefinition($(this));
                    }).get();
                }else{
                    return '';
                }
            };
            
            this.getFieldData = function($def){
                return this.getFieldDataFromSegments(this.getFieldSegments($def));
            }
            
            this.getFieldDataFromSegments = function(segments){
                var data = _data, 
                    segment;
                while((segment = segments.shift()) !== undefined){
                    var match;
                    if(match = segment.match(/\{\{INT_([^\}]*)\}\}/)){
                        segment = parseInt(match[1]);
                    }
                    if(data && data[segment] !== undefined){
                        data = data[segment];
                    }else{
                        return;
                    }
                }
                return data;
            };

            this.getFieldName = function($def){
                return this.getFieldSegments($def).join('|');
            };
            
            this.getFieldSegments = function($def){
                
                var segments = [],
                    
                    // .parents() returns in child -> parent order, so reverse and then loop
                    // so we get segments in parent -> child order
                    inheritanceTree = $def.parents('[name]').get().reverse();
            
                // add the current definition to the inheritanceTree
                inheritanceTree.push($def.get());
                
                $(inheritanceTree).each(function(){
                    
                    var name = $(this).attr('name');
                        
                    // if names does not have a bar in it, then this is a simple key
                    if(name.indexOf('|') == -1){
                        segments.push(name);
                    // if names has a bar in it, then we need to explode that into multiple
                    // segments to process
                    }else{
                        $.each(name.split('|'), function(idx, name){
                            segments.push(name);
                        });
                    }
                    
                });
                
                return segments;
            };
            
            this.getLabel = function($def){
                return $def.attr('label');
            };

            this.createXmlTag = function(tagName){
                return $($.parseXML('<xf:form xmlns:xf="TO_DEFINE"><'+tagName+'></'+tagName+'></xf:form>')).children().children().get()[0];
            };
        }
    };
    
})();

XFormR.registerRenderer('xf:boolean', function($def){
    var $selectDef = $(this.createXmlTag('xf:select'));
    $selectDef.attr('name', this.getFieldName($def));
    if($def.attr('label'))
        $selectDef.attr('label', $def.attr('label'));
    $('<option>').attr('value', '{{TYPE_TRUE}}').text('Yes').appendTo($selectDef);
    $('<option>').attr('value', '{{TYPE_FALSE}}').text('No').appendTo($selectDef);
    var $ele = this.renderType('xf:select', $selectDef),
        fieldData = this.getFieldData($def);
    this.applyHtmlAttributesFromDef($ele, $def);
    if(fieldData === undefined){
        switch($def.attr('default')){
            case 'true': fieldData = true; break;
            case 'false': fieldData = false; break;
            default: fieldData = true; break;
        }
    }
    if(fieldData === false){
        $ele.find('select').val('{{TYPE_FALSE}}');
    }else{
        $ele.find('select').val('{{TYPE_TRUE}}');
    }
    return $ele;
});

XFormR.registerRenderer('xf:date', function($def, data){
    
    var $ele = this.renderType('xf:input', $def.attr('type', 'date'), data),
        $input = $ele.find('input');
    
    if(this.getFieldData($def) === undefined){
        switch($def.attr('default')){
            case 'today': $input.val(new Date().toISOString().substring(0,10)); break;
        }
    }
    
    return $ele;
    
});

XFormR.registerRenderer('xf:form', function($def){
    var $form = $('<form>').append(this.renderDefinition($def.children())),
        $pages = $form.children('[data-page]').hide();
    if($pages.length > 0){
        var $pagesSelector = $('<div data-pages-selector>'),
            $previousPageButtonTop = $('<button type="button">').text('Previous').click(function(){
                if(pageIdx > 1){ buttons[pageIdx - 1].click(); }
            }),
            $previousPageButtonBottom = $previousPageButtonTop.clone(true),
            $nextPageButtonTop = $('<button type="button">').text('Next').click(function(){
                if(pageIdx < lastPageIdx){ buttons[pageIdx + 1].click(); }
            }),
            $nextPageButtonBottom = $nextPageButtonTop.clone(true),
            buttons = {},
            pageIdx = 1,
            lastPageIdx;
        $pages.each(function(){
            var $page = $(this);
            $page.attr('data-page', pageIdx);
            buttons[pageIdx] = $('<button type="button">')
                .attr('data-page-target', pageIdx)
                .text(pageIdx)
                .appendTo($pagesSelector)
                .click(function(){
                    pageIdx = parseInt($(this).attr('data-page-target'));
                    $pages.removeAttr('data-page-active').hide();
                    $page.attr('data-page-active', '').show();
                    $form.find('[data-page-target]').attr('data-page-target-active', null);
                    $form.find('[data-page-target="'+pageIdx+'"]').attr('data-page-target-active', '');
                    $previousPageButtonTop.attr('disabled', pageIdx == 1 ? '' : null);
                    $previousPageButtonBottom.attr('disabled', pageIdx == 1 ? '' : null);
                    $nextPageButtonTop.attr('disabled', pageIdx == lastPageIdx ? '' : null);
                    $nextPageButtonBottom.attr('disabled', pageIdx == lastPageIdx ? '' : null);
                    if($(window).scrollTop() > $form.offset().top){
                        $('html, body').animate({
                            scrollTop: ($form.offset().top)
                        },500);
                    }
                });
            pageIdx++;
        });
        lastPageIdx = pageIdx - 1;
        pageIdx = 1;
        $form.prepend($pagesSelector.clone(true).prepend($previousPageButtonTop).append($nextPageButtonTop));
        $form.append($pagesSelector.clone(true).prepend($previousPageButtonBottom).append($nextPageButtonBottom));
        buttons[pageIdx].click();
        $form.find('[data-page-target="1"]').attr('data-page-target-active', '');
    }
    return $form;
});

XFormR.registerRenderer('xf:group', function($def){
    var $ele = $('<fieldset>');
    this.applyHtmlAttributesFromDef($ele, $def);
    if($def.attr('label'))
        $('<legend>').text($def.attr('label')).appendTo($ele);
    $ele.append(this.renderDefinition($def.children()));
    return $ele;
});

XFormR.registerRenderer('xf:hidden', function($def){
    return this.renderType('xf:input', $def.attr('type', 'hidden'));
});

XFormR.registerRenderer('xf:image', function($def, data){
    var $ele = this.renderType('xf:input', $def.attr('type', 'file').attr('accept', 'image/*'), data),
        $input = $ele.find('input'),
        $preview = $('<img>').hide().insertBefore($input),
        $clearButton = $('<button type="button" data-image-remove>').text('Clear Image').hide().insertBefore($input);
    $input.change(function(){
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $preview.attr('src', e.target.result).show();
                $clearButton.show();
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
    $clearButton.click(function(){
        $input.replaceWith($input = $input.clone(true));
        $clearButton.hide();
        $preview.hide();
    });
    return $ele;
});

XFormR.registerRenderer('xf:input', function($def){
    var $ele = $('<div>');
    this.applyHtmlAttributesFromDef($ele, $def);
    if(this.getLabel($def))
        $('<label>').text(this.getLabel($def)).appendTo($ele);
    $('<input>').attr('type', $def.attr('type')).attr('name', this.getFieldName($def)).val(this.getFieldData($def)).appendTo($ele);
    return $ele;
});

XFormR.registerRenderer('xf:multivalue', function($def){
    var $ele = $('<div>'),
        self = this,
        counter = 0,
        addButtonText = $def.attr('add-button-text') ? $def.attr('add-button-text') : '+',
        removeButtonText = $def.attr('remove-button-text') ? $def.attr('remove-button-text') : 'x',
        createMultivalueGroup = function(){
            var fieldNameBase = self.getFieldName($def),
                fieldName = fieldNameBase+'|{{INT_'+counter+'}}',
                instanceDef = $(self.createXmlTag('xf:group')).attr('name', fieldName).append($def.children().clone()),
                $output = self.renderDefinition(instanceDef),
                multivalueIndex = counter,
                $removeButton = $('<button>')
                    .text(removeButtonText)
                    .click(function(){
                        $output.remove();
                        // decrement all multivalues after this
                        var i = multivalueIndex + 1,
                            regexFieldNameBase = '^'+fieldNameBase.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                        while(i < counter){
                            $ele.find('[name^="'+fieldNameBase+'|{{INT_'+i+'}}|"]').each(function(){
                                var regex = new RegExp(regexFieldNameBase+'\\|{{INT_([0-9]*)}}\\|(.*)'),
                                    match = regex.exec($(this).attr('name'));
                                $(this).attr('name', fieldNameBase+'|{{INT_'+(parseInt(match[1])-1)+'}}|'+match[2]);
                            });
                            i++;
                        }
                        counter--;
                    });
            $output.prepend($removeButton);
            $(this).before($output);
            counter++;
            return $output;
        },
        $button = $('<button type="button">').text(addButtonText).click(function(){
            var $output = createMultivalueGroup.call(this);
            self.invokeAfterRenderCallbacks($output);
        });
    this.applyHtmlAttributesFromDef($ele, $def);
    $ele.append($button);
    if(this.getFieldData($def))
        for(var i = 0; i < this.getFieldData($def).length; i++)
            createMultivalueGroup.call($button);
    return $ele;
});

XFormR.registerRenderer('xf:select', function($def){
    var $ele = $('<div>'), $select, $option;
    if(this.getLabel($def))
        $('<label>').text(this.getLabel($def)).appendTo($ele);
    $select = $('<select>').attr('name', this.getFieldName($def));
    $def.find('option').each(function(){
        $option = $('<option>');
        if($(this).attr('value'))
            $option.attr('value', $(this).attr('value'));
        $option.text($(this).text());
        $option.appendTo($select);
    });
    $select.val(this.getFieldData($def)).appendTo($ele);
    return $ele;
});

XFormR.registerRenderer('xf:page', function($def){
    var $ele = this.renderType('xf:group', $def);
    $ele.attr('data-page', '');
    return $ele;
});

XFormR.registerRenderer('xf:string', function($def){
    return this.renderType('xf:input', $def.attr('type', 'text'));
});

XFormR.registerRenderer('xf:text', function($def){
    var $ele = $('<div>');
    if(this.getLabel($def))
        $('<label>').text(this.getLabel($def)).appendTo($ele);
    $('<textarea>').attr('name', this.getFieldName($def)).val(this.getFieldData($def)).appendTo($ele);
    return $ele;
});

XFormR.registerRenderer('xf:ternary', function($def){
    var $selectDef = $(this.createXmlTag('xf:select'));
    $selectDef.attr('name', this.getFieldName($def));
    if($def.attr('label'))
        $selectDef.attr('label', $def.attr('label'));
    $('<option>').attr('value', '{{TYPE_TRUE}}').text('Yes').appendTo($selectDef);
    $('<option>').attr('value', '{{TYPE_FALSE}}').text('No').appendTo($selectDef);
    $('<option>').attr('value', '{{TYPE_NULL}}').text('N/A').appendTo($selectDef);
    var $ele = this.renderType('xf:select', $selectDef),
        fieldData = this.getFieldData($def);
    this.applyHtmlAttributesFromDef($ele, $def);
    if(fieldData === undefined){
        switch($def.attr('default')){
            case 'true': fieldData = true; break;
            case 'false': fieldData = false; break;
            case 'null': fieldData = null; break;
            default: fieldData = true; break;
        }
    }
    if(fieldData === false){
        $ele.find('select').val('{{TYPE_FALSE}}');
    }else if(fieldData === null){
        $ele.find('select').val('{{TYPE_NULL}}');
    }else{
        $ele.find('select').val('{{TYPE_TRUE}}');
    }
    return $ele;
});

XFormR.registerRenderer('xf:time', function($def){
    return this.renderType('xf:input', $def.attr('type', 'time'));
});

module.exports = XFormR;