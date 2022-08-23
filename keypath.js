// Copyright 2020 Hyperspaces. All rights reserved. MIT license.
export const keypath = (keypath, object) =>
  keypath.split('.').reduce((previous, current) => previous[current], object)
