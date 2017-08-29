#include <pebble.h>
#include "window.h"

// Keys for AppMessage Dictionary
// These should correspond to the values you defined in appinfo.json/Settings
enum {
	STATUS_KEY = 0,	
	MESSAGE_KEY = 1
};

static GBitmap *s_res_cameraicon;
static GBitmap *s_res_bursticon;
static GBitmap *s_res_timelapseicon;

// BEGIN AUTO-GENERATED UI CODE; DO NOT MODIFY
static Window *s_window;
static GBitmap *s_res_videoicon;
static GFont s_res_bitham_42_bold;
static GBitmap *s_res_battery2;
static GFont s_res_gothic_24;
static BitmapLayer *mode_iconlayer;
static TextLayer *current_textlayer;
static BitmapLayer *battery_iconlayer;
static TextLayer *remain_textlayer;

static void initialise_ui(void) {
  s_window = window_create();
  window_set_background_color(s_window, GColorBlack);
  #ifndef PBL_SDK_3
    window_set_fullscreen(s_window, 0);
  #endif
  
  s_res_videoicon = gbitmap_create_with_resource(RESOURCE_ID_videoIcon);
  s_res_bitham_42_bold = fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD);
  s_res_battery2 = gbitmap_create_with_resource(RESOURCE_ID_battery2);
  s_res_gothic_24 = fonts_get_system_font(FONT_KEY_GOTHIC_24);
  // mode_iconlayer
  mode_iconlayer = bitmap_layer_create(GRect(60, 25, 60, 34));
  bitmap_layer_set_bitmap(mode_iconlayer, s_res_videoicon);
  layer_add_child(window_get_root_layer(s_window), (Layer *)mode_iconlayer);
  
  // current_textlayer
  current_textlayer = text_layer_create(GRect(0, 65, 180, 50));
  text_layer_set_background_color(current_textlayer, GColorClear);
  text_layer_set_text_color(current_textlayer, GColorWhite);
  text_layer_set_text(current_textlayer, "00/0000");
  text_layer_set_text_alignment(current_textlayer, GTextAlignmentCenter);
  text_layer_set_font(current_textlayer, s_res_bitham_42_bold);
  layer_add_child(window_get_root_layer(s_window), (Layer *)current_textlayer);
  
  // battery_iconlayer
  battery_iconlayer = bitmap_layer_create(GRect(95, 130, 38, 19));
  bitmap_layer_set_bitmap(battery_iconlayer, s_res_battery2);
  layer_add_child(window_get_root_layer(s_window), (Layer *)battery_iconlayer);
  
  // remain_textlayer
  remain_textlayer = text_layer_create(GRect(26, 123, 60, 24));
  text_layer_set_background_color(remain_textlayer, GColorClear);
  text_layer_set_text_color(remain_textlayer, GColorWhite);
  text_layer_set_text(remain_textlayer, "00H00");
  text_layer_set_text_alignment(remain_textlayer, GTextAlignmentRight);
  text_layer_set_font(remain_textlayer, s_res_gothic_24);
  layer_add_child(window_get_root_layer(s_window), (Layer *)remain_textlayer);
}

static void destroy_ui(void) {
  window_destroy(s_window);
  bitmap_layer_destroy(mode_iconlayer);
  text_layer_destroy(current_textlayer);
  bitmap_layer_destroy(battery_iconlayer);
  text_layer_destroy(remain_textlayer);
  gbitmap_destroy(s_res_videoicon);
  gbitmap_destroy(s_res_battery2);
}
// END AUTO-GENERATED UI CODE

// Change GUI -->
void setMode(int mode, int recording) {
  if(recording == 1)
    window_set_background_color(s_window, GColorRed);
  else
    window_set_background_color(s_window, GColorBlack);
  
  switch (mode) {
    case 0:
      bitmap_layer_set_bitmap(mode_iconlayer, s_res_videoicon);
      break;

    case 1: 
      bitmap_layer_set_bitmap(mode_iconlayer, s_res_cameraicon);
      break;
    
    case 2:
      bitmap_layer_set_bitmap(mode_iconlayer, s_res_bursticon);
      break;
    
    case 3:
      bitmap_layer_set_bitmap(mode_iconlayer, s_res_timelapseicon);
      break;
    
    case 7:
      bitmap_layer_set_bitmap(mode_iconlayer, NULL);
      break;
    
  }
  layer_mark_dirty((Layer *)mode_iconlayer); //refresh image
}
void setBattery(int pct) {
  gbitmap_destroy(s_res_battery2);
  if (pct <= 11)
    s_res_battery2 = gbitmap_create_with_resource(RESOURCE_ID_battery0);
  else if (pct <= 40)
    s_res_battery2 = gbitmap_create_with_resource(RESOURCE_ID_battery1);
  else if (pct <= 70)
    s_res_battery2 = gbitmap_create_with_resource(RESOURCE_ID_battery2);
  else
    s_res_battery2 = gbitmap_create_with_resource(RESOURCE_ID_battery3);
  
  bitmap_layer_set_bitmap(battery_iconlayer, s_res_battery2);
  layer_mark_dirty((Layer *)battery_iconlayer);
}
void set_text(char* currentText, char* remainText) {
  text_layer_set_text(current_textlayer, currentText);
  text_layer_set_text(remain_textlayer, remainText);
}
// Change GUI <--

// Events -->
void sendMessage(char* message) {
  DictionaryIterator *iter;
	
	app_message_outbox_begin(&iter);
	dict_write_cstring(iter, MESSAGE_KEY, message);
	dict_write_end(iter);
  app_message_outbox_send();
}
static void select_click_handler(ClickRecognizerRef recognizer, void *context) {
  sendMessage("SELECT");
}

static void up_click_handler(ClickRecognizerRef recognizer, void *context) {
  sendMessage("UP");
}

static void down_click_handler(ClickRecognizerRef recognizer, void *context) {
  sendMessage("DOWN");
}

static void click_config_provider(void *context) {
  window_single_click_subscribe(BUTTON_ID_SELECT, select_click_handler);
  window_single_click_subscribe(BUTTON_ID_UP, up_click_handler);
  window_single_click_subscribe(BUTTON_ID_DOWN, down_click_handler);
}
// Events <-- 

static void init_ui(void) {
  // Use this provider to add button click subscriptions
  window_set_click_config_provider(s_window, click_config_provider); 
  
  //set transparency
  bitmap_layer_set_compositing_mode(battery_iconlayer, GCompOpSet);
  bitmap_layer_set_compositing_mode(mode_iconlayer, GCompOpSet);
  
  s_res_cameraicon    = gbitmap_create_with_resource(RESOURCE_ID_cameraIcon);
  s_res_bursticon     = gbitmap_create_with_resource(RESOURCE_ID_burst);
  s_res_timelapseicon = gbitmap_create_with_resource(RESOURCE_ID_timelapse);
}

static void handle_window_unload(Window* window) {
  destroy_ui();
  gbitmap_destroy(s_res_cameraicon);
  gbitmap_destroy(s_res_bursticon);
  gbitmap_destroy(s_res_timelapseicon);
}

void show_window(void) {
  initialise_ui();
  init_ui();
  window_set_window_handlers(s_window, (WindowHandlers) {
    .unload = handle_window_unload,
  });
  window_stack_push(s_window, true);
}

void hide_window(void) {
  window_stack_remove(s_window, true);
}
