#include <pebble.h>

void show_window(void);
void hide_window(void);

void setMode(int mode, int recording);
void set_backgroundColor(GColor color);
void setBattery(int pct);
void set_text(char* currentText, char* remainText);
void sendMessage(char* message);
//void text(int recording, int battery, char* remainText, char* recTimeText, char* videoCountText);
//char* tupleStr(DictionaryIterator *received, int dict);
//int tupleInt(DictionaryIterator *received, int dict);