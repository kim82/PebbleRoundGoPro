#include <pebble.h>
#include "window.h"
#include "loadscreen.h"

// Keys for AppMessage Dictionary
enum {
	STATUS_KEY = 0,	
	MESSAGE_KEY = 1,
  MODE = 2,
  CURRENT = 3,
  REMAIN = 4,
	BATTERY = 5,
	RECORDING = 6,
};
static bool initialized = false;
static int mode = -1;

char* tupleStr(DictionaryIterator *received, int dict) {
  Tuple *tuple;
  tuple = dict_find(received, dict);
	if(tuple) {
		return tuple->value->cstring;
	} 
  return "";
}
int tupleInt(DictionaryIterator *received, int dict) {
  Tuple *tuple;
  tuple = dict_find(received, dict);
	if(tuple) {
		return (int)tuple->value->uint32;
	} 
  return -1;
}

// Called when a message is received from PebbleKitJS
static void in_received_handler(DictionaryIterator *received, void *context) {
  bool ok = false;
  Tuple *tuple;
  
	tuple = dict_find(received, STATUS_KEY);
	if(tuple) {
    ok = ((int)tuple->value->uint32) == 1;
		//APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Status: %d", (int)tuple->value->uint32); 
	}
	if (ok) {
    /*
  	tuple = dict_find(received, MESSAGE_KEY);
  	if(tuple) {
  		APP_LOG(APP_LOG_LEVEL_DEBUG, "Received Message: %s", tuple->value->cstring);
  	}*/
    
    if (!initialized) {
      initialized = true;
      hide_loadscreen();
      show_window();
    }
    
    mode = tupleInt(received, MODE);
    setMode(mode, tupleInt(received, RECORDING));
    setBattery(tupleInt(received, BATTERY));
    set_text(tupleStr(received, CURRENT), tupleStr(received, REMAIN));
  }
  else {
    if (initialized) {
      initialized = false;
      hide_window();
      show_loadscreen();
    }
  }
}

// Called when an incoming message from PebbleKitJS is dropped
static void in_dropped_handler(AppMessageResult reason, void *context) {	
}

// Called when PebbleKitJS does not acknowledge receipt of a message
static void out_failed_handler(DictionaryIterator *failed, AppMessageResult reason, void *context) {
}

static void init(void) {
  show_loadscreen();
  
  // Register AppMessage handlers
  app_message_register_inbox_received(in_received_handler); 
  app_message_register_inbox_dropped(in_dropped_handler); 
  app_message_register_outbox_failed(out_failed_handler);

  // Initialize AppMessage inbox and outbox buffers with a suitable size
  const int inbox_size = 128;
  const int outbox_size = 128;
  app_message_open(inbox_size, outbox_size);
}

static void deinit(void) {
  if (initialized)
    hide_window();
  else
    hide_loadscreen();
  app_message_deregister_callbacks();
}

int main(void) {
	init();
	app_event_loop();
	deinit();
}
