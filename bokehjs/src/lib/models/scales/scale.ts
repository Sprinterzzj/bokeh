import {Transform} from "../transforms"
import {Range} from "../ranges/range"
import {Range1d} from "../ranges/range1d"
import {Arrayable} from "core/types"
import * as p from "core/properties"

export namespace Scale {
  export type Attrs = p.AttrsOf<Props>

  export type Props = Transform.Props & {
    source_range: p.Property<Range>
    target_range: p.Property<Range1d>
  }
}

export interface Scale extends Scale.Attrs {}

export abstract class Scale extends Transform {
  properties: Scale.Props

  constructor(attrs?: Partial<Scale.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "Scale"

    this.internal({
      source_range: [ p.Any ],
      target_range: [ p.Any ], // p.Instance(Range1d)
    })
  }

  abstract compute(x: number): number

  abstract v_compute(xs: Arrayable<number>): Arrayable<number>

  abstract invert(sx: number): number

  abstract v_invert(sxs: Arrayable<number>): Arrayable<number>

  // TODO - NEEDS TO BE CAREFUL AND THOUGHTFUL, THIS IS JUST A SIMPLE EXAMPLE
  screen_min(): number {
    return this.target_range.start
  }

  screen_max(): number {
    return 0
  }

  r_compute(x0: number, x1: number): [number, number] {
    if (this.target_range.is_reversed)
      return [this.compute(x1), this.compute(x0)]
    else
      return [this.compute(x0), this.compute(x1)]
  }

  r_invert(sx0: number, sx1: number): [number, number] {
    if (this.target_range.is_reversed)
      return [this.invert(sx1), this.invert(sx0)]
    else
      return [this.invert(sx0), this.invert(sx1)]
  }
}
Scale.initClass()
