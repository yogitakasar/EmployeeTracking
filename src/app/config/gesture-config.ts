import { Injectable } from '@angular/core';
import {
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import * as Hammer from 'hammerjs'; // Import Hammer

@Injectable()
export class CustomGestureConfig extends HammerGestureConfig {
  override overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL }, // Use Hammer types
  };
}
