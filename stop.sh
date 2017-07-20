#!/bin/bash
ps aux | grep -ie yayforwallpapers | awk '{print $2}' | xargs kill -9
